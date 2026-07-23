import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { useOnboardingStore } from '@/features/onboarding/store';
import { ImprovementsList } from './ImprovementsList';

describe('ImprovementsList', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({ stage: 'threeLists', subStep: 2 });
  });

  it('shows the buffet framing, prompts, and minimum before allowing Next', async () => {
    const { getByRole, getByText } = await render(<ImprovementsList />);

    expect(
      getByText(
        /All skills are freely available — take everything you want and put it on your plate\./,
      ),
    ).toBeTruthy();
    expect(getByText('Where do you feel you want to grow?')).toBeTruthy();
    expect(
      getByText(
        'Have you hit obstacles during a rehearsal or performance? What were they?',
      ),
    ).toBeTruthy();
    expect(
      getByText(
        'Have you received feedback from other musicians that you thought was fair?',
      ),
    ).toBeTruthy();
    expect(
      getByText(
        'Is there something that bothers you when you listen to your own recordings?',
      ),
    ).toBeTruthy();
    expect(getByText('Add at least 3 improvements to continue.')).toBeTruthy();
    expect(getByRole('button', { name: 'Next' }).props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it('trims, stores, deletes, and advances with three improvements', async () => {
    const musicians = ['Miles', 'Herbie', 'Wayne', 'Tony', 'Ron'];
    useOnboardingStore.setState({
      threeLists: {
        who: musicians,
        why: Object.fromEntries(musicians.map((name) => [name, ['Musicality']])),
        improvements: [],
      },
    });

    const { getByLabelText, getByRole } = await render(<ImprovementsList />);

    for (const value of ['  Steady time  ', 'Better sight-reading', 'Open improvisation']) {
      await fireEvent.changeText(getByLabelText('Improvement'), value);
      await fireEvent.press(getByRole('button', { name: 'Add' }));
    }

    expect(useOnboardingStore.getState().threeLists.improvements).toEqual([
      'Steady time',
      'Better sight-reading',
      'Open improvisation',
    ]);

    await fireEvent.press(getByRole('button', { name: 'Remove Better sight-reading' }));
    expect(useOnboardingStore.getState().threeLists.improvements).toEqual([
      'Steady time',
      'Open improvisation',
    ]);

    await fireEvent.changeText(getByLabelText('Improvement'), 'Another goal');
    await fireEvent.press(getByRole('button', { name: 'Add' }));
    await fireEvent.press(getByRole('button', { name: 'Next' }));

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'characteristics',
      subStep: 0,
    });
  });

  it('shows a nudge at twelve items without imposing a maximum', async () => {
    useOnboardingStore.setState({
      threeLists: {
        who: [],
        why: {},
        improvements: Array.from({ length: 12 }, (_, index) => `Goal ${index + 1}`),
      },
    });

    const { getByText, getByLabelText, getByRole } = await render(
      <ImprovementsList />,
    );

    expect(
      getByText(
        "That's a lot — remember you'll distill these into characteristics next.",
      ),
    ).toBeTruthy();

    await fireEvent.changeText(getByLabelText('Improvement'), 'Goal 13');
    await fireEvent.press(getByRole('button', { name: 'Add' }));

    expect(useOnboardingStore.getState().threeLists.improvements).toHaveLength(13);
  });
});
