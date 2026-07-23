import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { IntroScreen } from './IntroScreen';
import { useOnboardingStore } from '../store';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('IntroScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    useOnboardingStore.getState().reset();
  });

  it('offers a skip action that returns to the previous route', async () => {
    const { getByRole } = await render(<IntroScreen />);

    fireEvent.press(getByRole('button', { name: 'Skip for now' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('advances to the next stage when getting started', async () => {
    const { getByRole } = await render(<IntroScreen />);

    fireEvent.press(getByRole('button', { name: 'Get Started' }));

    expect(useOnboardingStore.getState().stage).toBe('threeLists');
  });
});
