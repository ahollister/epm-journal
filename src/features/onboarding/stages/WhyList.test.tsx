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
import { WhyList } from './WhyList';

const musicians = ['Herbie Hancock', 'Alice Coltrane', 'Wayne Shorter', 'Jaco Pastorius', 'Tony Williams'];

function showWhyList(why: Record<string, string[]> = {}) {
  useOnboardingStore.setState({
    stage: 'threeLists',
    subStep: 1,
    threeLists: { who: musicians, why, improvements: [] },
  });

  return render(<WhyList />);
}

describe('WhyList', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it('shows the prompts and flags every musician until they have a quality', async () => {
    const { getAllByLabelText, getByRole, getByText } = await showWhyList();

    expect(getByText('Why is this person a favourite? What struck you about their playing?')).toBeTruthy();
    expect(getByText('What does their playing represent to you?')).toBeTruthy();
    expect(getByText(/What are they particularly good at/)).toBeTruthy();
    expect(getByText('What have they really mastered?')).toBeTruthy();
    expect(getAllByLabelText(/Missing a why entry/)).toHaveLength(musicians.length);
    expect(getByRole('button', { name: 'Next' }).props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it('stores multiple free-text qualities by musician and moves to Improvements', async () => {
    const { getAllByText, getByLabelText, getByRole } = await showWhyList();

    for (const musician of musicians) {
      await fireEvent.changeText(
        getByLabelText(`Why for ${musician}, entry 1`),
        `${musician} quality`,
      );
    }

    await fireEvent.press(getAllByText('Add another')[0]);
    await fireEvent.changeText(
      getByLabelText('Why for Herbie Hancock, entry 2'),
      'Harmonic imagination',
    );

    expect(useOnboardingStore.getState().threeLists.why).toEqual({
      'Herbie Hancock': ['Herbie Hancock quality', 'Harmonic imagination'],
      'Alice Coltrane': ['Alice Coltrane quality'],
      'Wayne Shorter': ['Wayne Shorter quality'],
      'Jaco Pastorius': ['Jaco Pastorius quality'],
      'Tony Williams': ['Tony Williams quality'],
    });

    await fireEvent.press(getByRole('button', { name: 'Next' }));
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 2,
    });
  });

  it('returns to Who without discarding entered qualities', async () => {
    const { getByRole } = await showWhyList({
      'Herbie Hancock': ['Inventive'],
    });

    await fireEvent.press(getByRole('button', { name: 'Back' }));

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 0,
      threeLists: {
        why: { 'Herbie Hancock': ['Inventive'] },
      },
    });
  });
});
