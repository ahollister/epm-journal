import { act, fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { useOnboardingStore } from '../store';
import { ConfirmationScreen } from './ConfirmationScreen';

const characteristics = [
  { id: 'tone', name: 'Tone', order: 1, score: 2 },
  { id: 'timing', name: 'Timing', order: 2, score: 5 },
  { id: 'technique', name: 'Technique', order: 3, score: 8 },
];

describe('ConfirmationScreen', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({
      stage: 'confirm',
      characteristics,
    });
  });

  it('shows the interactive wheel and advances with a non-flat wheel', async () => {
    const screen = await render(<ConfirmationScreen />);

    expect(screen.getByText('Your skill wheel is ready')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeOnTheScreen();
    expect(screen.queryByText(/Your scores are very close together/)).toBeNull();

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    });

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'focus',
      subStep: 0,
    });
  });

  it('nudges on a flat wheel but still allows proceeding', async () => {
    useOnboardingStore.setState({
      characteristics: characteristics.map((characteristic) => ({
        ...characteristic,
        score: 5,
      })),
    });
    const screen = await render(<ConfirmationScreen />);

    expect(
      screen.getByText(
        'Your scores are very close together. Every musician has relative strengths and weaknesses. Would you like to review your ratings?',
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Review ratings' })).toBeOnTheScreen();

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Proceed anyway' }));
    });

    expect(useOnboardingStore.getState().stage).toBe('focus');
  });

  it('returns to the first rating when reviewing from the nudge', async () => {
    useOnboardingStore.setState({
      characteristics: characteristics.map((characteristic) => ({
        ...characteristic,
        score: 5,
      })),
    });
    const screen = await render(<ConfirmationScreen />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Review ratings' }));
    });

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 0,
    });
  });

  it('navigates to the tapped characteristic rating', async () => {
    const screen = await render(<ConfirmationScreen />);

    await act(() => {
      fireEvent.press(screen.getByTestId('skill-wheel-hit-technique'));
    });

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 2,
    });
  });
});
