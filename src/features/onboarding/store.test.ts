import { baselineRepository } from './data/baselineRepository';
import { useOnboardingStore } from './store';

jest.mock('./data/baselineRepository', () => ({
  baselineRepository: {
    completeOnboarding: jest.fn(),
  },
}));

const completeOnboarding = jest.mocked(baselineRepository.completeOnboarding);

describe('useOnboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    completeOnboarding.mockReset();
    completeOnboarding.mockResolvedValue(undefined);
  });

  it('preserves ratings when renaming and drops them when removing characteristics', () => {
    const store = useOnboardingStore.getState();

    store.addCharacteristic('Timing');
    store.addCharacteristic('Dynamics');
    store.addCharacteristic('Phrasing');

    const [timing, dynamics, phrasing] = useOnboardingStore.getState().characteristics;
    store.rateCharacteristic(timing.id, 7);
    store.renameCharacteristic(timing.id, 'Steady timing');
    store.removeCharacteristic(dynamics.id);

    expect(useOnboardingStore.getState().characteristics).toEqual([
      { ...timing, name: 'Steady timing', order: 1, score: 7 },
      { ...phrasing, order: 2 },
    ]);
  });

  it('gates next at an incomplete stage and resets the cursor at boundaries', () => {
    const store = useOnboardingStore.getState();

    store.next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 0,
    });

    store.next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 0,
    });

    useOnboardingStore.setState({
      threeLists: {
        who: ['one', 'two', 'three', 'four', 'five'],
        why: {
          one: ['reason'],
          two: ['reason'],
          three: ['reason'],
          four: ['reason'],
          five: ['reason'],
        },
        improvements: ['one', 'two', 'three'],
      },
    });
    store.next();
    expect(useOnboardingStore.getState().subStep).toBe(1);

    useOnboardingStore.setState({
      characteristics: [
        { id: 'one', name: 'One', order: 1 },
        { id: 'two', name: 'Two', order: 2 },
        { id: 'three', name: 'Three', order: 3 },
      ],
      stage: 'characteristics',
      subStep: 0,
    });
    store.next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 0,
    });
  });

  it('persists the baseline only when complete succeeds', async () => {
    const store = useOnboardingStore.getState();
    store.addCharacteristic('Timing');
    const characteristic = useOnboardingStore.getState().characteristics[0];
    store.rateCharacteristic(characteristic.id, 8);
    store.setFocusAreas([characteristic.id]);

    await store.complete();

    expect(completeOnboarding).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 1,
        characteristics: [{ ...characteristic, score: 8 }],
        focusAreas: [characteristic.id],
        userId: 'local',
        createdAt: expect.any(String),
      }),
    );
    expect(useOnboardingStore.getState().stage).toBe('complete');
  });

  it('keeps the current stage and exposes completion errors', async () => {
    const error = new Error('storage unavailable');
    completeOnboarding.mockRejectedValueOnce(error);
    useOnboardingStore.setState({ stage: 'focus' });

    await expect(useOnboardingStore.getState().complete()).rejects.toThrow(
      'storage unavailable',
    );
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'focus',
      error: 'storage unavailable',
    });
  });

  it('resets all in-memory onboarding state', () => {
    const store = useOnboardingStore.getState();
    store.addCharacteristic('Timing');
    store.setFocusAreas(['id']);
    useOnboardingStore.setState({ stage: 'focus', subStep: 2 });

    store.reset();

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'intro',
      subStep: 0,
      threeLists: { who: [], why: {}, improvements: [] },
      characteristics: [],
      focusAreas: [],
      error: null,
    });
  });
});
