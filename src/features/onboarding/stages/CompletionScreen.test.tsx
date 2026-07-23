import { fireEvent, render } from '@testing-library/react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { CompletionScreen } from './CompletionScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe('CompletionScreen', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    useOnboardingStore.getState().reset();
  });

  it('confirms the saved baseline and lists selected focus areas', async () => {
    useOnboardingStore.setState({
      stage: 'complete',
      characteristics: [
        { id: 'timing', name: 'Timing', order: 1, score: 6 },
        { id: 'tone', name: 'Tone', order: 2, score: 7 },
      ],
      focusAreas: ['timing', 'tone'],
    });

    const { getByText } = await render(<CompletionScreen />);

    expect(getByText('Your baseline is saved')).toBeTruthy();
    expect(
      getByText('Your focus for your first cycle: Timing, Tone'),
    ).toBeTruthy();
  });

  it('replaces the route with Practice or Progress from the CTAs', async () => {
    const { getByText } = await render(<CompletionScreen />);

    await fireEvent.press(getByText('Start your first session'));
    expect(mockReplace).toHaveBeenLastCalledWith('/(tabs)');

    await fireEvent.press(getByText('Explore your Progress'));
    expect(mockReplace).toHaveBeenLastCalledWith('/(tabs)/progress');
  });

  it('does not render a focus sentence when no areas were selected', async () => {
    const { queryByText } = await render(<CompletionScreen />);

    expect(queryByText(/Your focus for your first cycle/)).toBeNull();
  });
});
