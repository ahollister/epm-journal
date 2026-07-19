jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

import { baselineRepository } from './data/baselineRepository';
import { useOnboardingStore } from './store';

const completeThreeLists = {
  who: ['one', 'two', 'three', 'four', 'five'],
  why: {
    one: ['reason'],
    two: ['reason'],
    three: ['reason'],
    four: ['reason'],
    five: ['reason'],
  },
  improvements: ['one', 'two', 'three'],
};

const characteristics = [
  { id: 'first', name: 'First', order: 1, score: 4 },
  { id: 'second', name: 'Second', order: 2, score: 7 },
  { id: 'third', name: 'Third', order: 3, score: 5 },
];

describe('useOnboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    jest.restoreAllMocks();
  });

  it('adds, renames, and removes characteristics without losing unrelated ratings', () => {
    useOnboardingStore.getState().addCharacteristic('Timing');
    useOnboardingStore.getState().addCharacteristic('  Tone  ');

    const [timing, tone] = useOnboardingStore.getState().characteristics;
    expect(timing).toMatchObject({ name: 'Timing', order: 1, score: undefined });
    expect(tone).toMatchObject({ name: 'Tone', order: 2, score: undefined });

    useOnboardingStore.getState().rateCharacteristic(timing.id, 8);
    useOnboardingStore.getState().renameCharacteristic(timing.id, 'Steady timing');
    expect(useOnboardingStore.getState().characteristics).toEqual([
      { ...timing, name: 'Steady timing', score: 8 },
      tone,
    ]);

    useOnboardingStore.getState().removeCharacteristic(tone.id);
    expect(useOnboardingStore.getState().characteristics).toEqual([
      { ...timing, name: 'Steady timing', score: 8, order: 1 },
    ]);
  });

  it('rejects empty characteristic names', () => {
    useOnboardingStore.getState().addCharacteristic('   ');
    expect(useOnboardingStore.getState().characteristics).toEqual([]);
  });

  it('gates stage advancement and resets the sub-step at boundaries', () => {
    useOnboardingStore.setState({ stage: 'threeLists' });
    useOnboardingStore.getState().next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 0,
    });

    useOnboardingStore.setState({
      threeLists: completeThreeLists,
      subStep: 0,
    });
    useOnboardingStore.getState().next();
    useOnboardingStore.getState().next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 2,
    });

    useOnboardingStore.getState().next();
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'characteristics',
      subStep: 0,
    });
  });

  it('requests dismissal when going back from intro without clearing data', () => {
    useOnboardingStore.setState({
      characteristics: [characteristics[0]],
      focusAreas: ['first'],
    });

    useOnboardingStore.getState().back();

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'intro',
      shouldDismiss: true,
      characteristics: [characteristics[0]],
      focusAreas: ['first'],
    });
  });

  it('jumps to the selected characteristic rating', () => {
    useOnboardingStore.setState({ characteristics });

    useOnboardingStore.getState().goToCharacteristicRating('second');

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 1,
    });
  });

  it('completes onboarding through the repository and advances to complete', async () => {
    const completeOnboarding = jest
      .spyOn(baselineRepository, 'completeOnboarding')
      .mockResolvedValue(undefined);
    useOnboardingStore.setState({ characteristics, focusAreas: ['first'] });

    await useOnboardingStore.getState().complete();

    expect(completeOnboarding).toHaveBeenCalledWith({
      version: 1,
      characteristics,
      focusAreas: ['first'],
      createdAt: expect.any(String),
      userId: 'local',
    });
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'complete',
      subStep: 0,
      error: null,
    });
  });

  it('stays on the current stage and exposes repository errors', async () => {
    const error = new Error('storage unavailable');
    jest
      .spyOn(baselineRepository, 'completeOnboarding')
      .mockRejectedValue(error);
    useOnboardingStore.setState({ stage: 'focus' });

    await expect(useOnboardingStore.getState().complete()).rejects.toBe(error);

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'focus',
      error,
    });
  });

  it('resets every onboarding field', () => {
    useOnboardingStore.setState({
      stage: 'focus',
      subStep: 3,
      threeLists: completeThreeLists,
      characteristics,
      focusAreas: ['first', 'second'],
      error: new Error('old error'),
    });

    useOnboardingStore.getState().reset();

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'intro',
      subStep: 0,
      threeLists: { who: [], why: {}, improvements: [] },
      characteristics: [],
      focusAreas: [],
      shouldDismiss: false,
      error: null,
    });
  });
});
