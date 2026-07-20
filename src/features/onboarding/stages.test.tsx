import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { Intro } from './stages';
import { useOnboardingStore } from './store';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('Intro', () => {
  beforeEach(() => {
    mockBack.mockClear();
    useOnboardingStore.getState().reset();
  });

  it('offers a skip action that returns to the previous route', async () => {
    const { getByRole } = await render(<Intro />);

    fireEvent.press(getByRole('button', { name: 'Skip for now' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
