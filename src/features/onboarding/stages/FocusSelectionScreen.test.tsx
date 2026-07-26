import { act, fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { baselineRepository } from '../data/baselineRepository';
import { useOnboardingStore } from '../store';
import { FocusSelectionScreen } from './FocusSelectionScreen';

const characteristics = [
  { id: 'order-one', name: 'Order one', order: 1, score: 4 },
  { id: 'order-two', name: 'Order two', order: 2, score: 8 },
  { id: 'order-three', name: 'Order three', order: 3, score: 4 },
  { id: 'order-four', name: 'Order four', order: 4, score: 9 },
];

describe('FocusSelectionScreen', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({ stage: 'focus', characteristics });
    jest
      .spyOn(baselineRepository, 'completeOnboarding')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows every characteristic ranked by score and then user order', async () => {
    const screen = await render(<FocusSelectionScreen />);
    const rows = screen.getAllByRole('button');

    expect(rows[0]).toHaveTextContent(/Order one/);
    expect(rows[0]).toHaveTextContent(/4 \/ 10/);
    expect(rows[1]).toHaveTextContent(/Order three/);
    expect(rows[2]).toHaveTextContent(/Order two/);
    expect(rows[3]).toHaveTextContent(/Order four/);
  });

  it('uses the flat tip before the large-gap tip', async () => {
    useOnboardingStore.setState({
      characteristics: characteristics.map((item) => ({ ...item, score: 5 })),
    });
    const screen = await render(<FocusSelectionScreen />);

    expect(
      screen.getByText(
        'Your scores are close together — any area you focus on will raise your overall playing. Pick what feels most motivating.',
      ),
    ).toBeOnTheScreen();
  });

  it('shows the cap feedback without selecting a third row', async () => {
    const screen = await render(<FocusSelectionScreen />);

    await act(() => fireEvent.press(screen.getByTestId('focus-option-order-one')));
    await act(() => fireEvent.press(screen.getByTestId('focus-option-order-three')));
    await act(() => fireEvent.press(screen.getByTestId('focus-option-order-two')));

    expect(screen.getByText('2 of 2 selected')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Pick 1 or 2 focus areas — more than 2 dilutes your focus.',
      ),
    ).toBeOnTheScreen();
    expect(
      screen.getByTestId('focus-option-order-two').props.accessibilityState,
    ).toEqual({ selected: false });
  });

  it('stores selected ids before continuing', async () => {
    const screen = await render(<FocusSelectionScreen />);

    await act(() => fireEvent.press(screen.getByTestId('focus-option-order-three')));
    await act(() =>
      fireEvent.press(screen.getByRole('button', { name: 'Continue' })),
    );

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'complete',
      focusAreas: ['order-three'],
    });
  });

  it('skips without retaining an earlier focus selection', async () => {
    useOnboardingStore.setState({ focusAreas: ['order-two'] });
    const screen = await render(<FocusSelectionScreen />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Skip for now' }));
    });

    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'complete',
      focusAreas: [],
    });
  });
});
