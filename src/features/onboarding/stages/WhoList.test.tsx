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
import { WhoList } from './WhoList';

describe('WhoList', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({ stage: 'threeLists', subStep: 0 });
  });

  it('adds names and advances to Why once the minimum is met', async () => {
    const { getByLabelText, getByRole, getByText } = await render(<WhoList />);

    expect(getByText('Add at least 5 names to continue.')).toBeTruthy();
    expect(getByRole('button', { name: 'Next' }).props.accessibilityState).toEqual({
      disabled: true,
    });

    for (const name of ['  Herbie Hancock  ', 'Alice Coltrane', 'Wayne Shorter', 'Jaco Pastorius', 'Tony Williams']) {
      await fireEvent.changeText(getByLabelText('Musician name'), name);
      await fireEvent.press(getByRole('button', { name: 'Add' }));
    }

    expect(useOnboardingStore.getState().threeLists.who).toEqual([
      'Herbie Hancock',
      'Alice Coltrane',
      'Wayne Shorter',
      'Jaco Pastorius',
      'Tony Williams',
    ]);

    await fireEvent.press(getByRole('button', { name: 'Next' }));
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 1,
    });
  });
});
