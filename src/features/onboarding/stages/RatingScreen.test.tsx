import { act, cleanup, fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { useOnboardingStore } from '../store';
import { RatingScreen } from './RatingScreen';

const characteristics = [
  { id: 'tone', name: 'Tone quality', order: 1 },
  { id: 'timing', name: 'Timing', order: 2 },
  { id: 'improvisation', name: 'Improvisation', order: 3 },
];

describe('RatingScreen', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({
      stage: 'rating',
      subStep: 0,
      characteristics,
    });
  });

  afterEach(async () => {
    await cleanup();
  });

  it('shows one characteristic, all four prompts, and an unset score', async () => {
    const screen = await render(<RatingScreen />);

    expect(screen.getByText('Tone quality')).toBeOnTheScreen();
    expect(screen.queryByText('Timing')).toBeNull();
    expect(
      screen.getByText('What would you be able to do if you were a 10 in this?'),
    ).toBeOnTheScreen();
    expect(screen.getByText('What elements are included in this area?')).toBeOnTheScreen();
    expect(
      screen.getByText("Why aren't you already at 10 — what's missing?"),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('What is the absolute best you could imagine here?'),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Rate next' })).toBeDisabled();
  });

  it('stores a score, shows the midpoint nudge, and lets the user keep 5', async () => {
    const screen = await render(<RatingScreen />);

    await act(() => {
      fireEvent.press(screen.getByText('5'));
    });

    expect(useOnboardingStore.getState().characteristics[0].score).toBe(5);
    expect(
      screen.getByText(
        "5 is the hardest score to learn from. Do you lean closer to 'I can do this sometimes' (4) or 'I can usually do this' (6)?",
      ),
    ).toBeOnTheScreen();

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Keep 5' }));
    });

    expect(screen.queryByText(/hardest score to learn from/)).toBeNull();
    expect(useOnboardingStore.getState().characteristics[0].score).toBe(5);
  });

  it('overwrites the midpoint with the selected nudge direction', async () => {
    const screen = await render(<RatingScreen />);

    await act(() => {
      fireEvent.press(screen.getByText('5'));
    });
    await act(() => {
      fireEvent.press(screen.getByText('I can usually do this (6)'));
    });

    expect(useOnboardingStore.getState().characteristics[0].score).toBe(6);
    expect(screen.queryByText(/hardest score to learn from/)).toBeNull();
  });

  it('truncates a long name and expands it when tapped', async () => {
    const longName = 'A'.repeat(81);
    useOnboardingStore.setState({
      characteristics: [{ ...characteristics[0], name: longName }],
    });
    const screen = await render(<RatingScreen />);

    expect(screen.getByText(`${'A'.repeat(80)}…`)).toBeOnTheScreen();

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Expand characteristic name' }));
    });

    expect(screen.getByText(longName)).toBeOnTheScreen();
  });

  it('advances one characteristic at a time and gates the final transition', async () => {
    const screen = await render(<RatingScreen />);

    await act(() => {
      fireEvent.press(screen.getByText('4'));
    });
    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Rate next' }));
    });

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 1,
    });
    expect(screen.getByText('Timing')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Rate next' })).toBeDisabled();
  });
});
