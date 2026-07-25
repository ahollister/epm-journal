import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { useOnboardingStore } from '../store';
import { CharacteristicReview } from './CharacteristicReview';

const characteristics = [
  { id: 'tone', name: 'Tone', order: 1, score: 8 },
  { id: 'timing', name: 'Timing', order: 2, score: 5 },
  { id: 'improvisation', name: 'Improvisation', order: 3 },
];

describe('CharacteristicReview', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({
      stage: 'characteristics',
      subStep: 1,
      characteristics,
    });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await cleanup();
  });

  it('shows the coverage question and all characteristic controls', async () => {
    const screen = await render(<CharacteristicReview />);

    expect(screen.getByText('Tone')).toBeOnTheScreen();
    expect(screen.getByText('Timing')).toBeOnTheScreen();
    expect(screen.getByText('Improvisation')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'If you were a 10 out of 10 in each of these areas, would you be fully satisfied with your playing? Would this allow you to do everything you want to do as a musician?',
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Move Tone up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move Improvisation down' })).toBeDisabled();
  });

  it('moves characteristics and keeps sequential order and ratings', async () => {
    const screen = await render(<CharacteristicReview />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Move Timing up' }));
    });

    expect(useOnboardingStore.getState().characteristics).toEqual([
      { id: 'timing', name: 'Timing', order: 1, score: 5 },
      { id: 'tone', name: 'Tone', order: 2, score: 8 },
      { id: 'improvisation', name: 'Improvisation', order: 3 },
    ]);
  });

  it('renames inline without changing the characteristic id or score', async () => {
    const screen = await render(<CharacteristicReview />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Edit Tone' }));
    });
    const input = screen.getByLabelText('Edit characteristic Tone');
    await act(() => {
      fireEvent.changeText(input, 'Tone quality');
    });
    await act(() => {
      fireEvent(input, 'submitEditing');
    });

    expect(useOnboardingStore.getState().characteristics[0]).toEqual({
      id: 'tone',
      name: 'Tone quality',
      order: 1,
      score: 8,
    });
  });

  it('confirms removal and closes the gap in order values', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Remove')?.onPress?.();
    });
    const screen = await render(<CharacteristicReview />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Remove Timing' }));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Remove this characteristic?',
      'Its rating will also be removed.',
      expect.any(Array),
    );
    expect(useOnboardingStore.getState().characteristics).toEqual([
      { id: 'tone', name: 'Tone', order: 1, score: 8 },
      { id: 'improvisation', name: 'Improvisation', order: 2 },
    ]);
  });

  it('returns to definition or advances to rating at the stage boundary', async () => {
    const screen = await render(<CharacteristicReview />);

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: "No, I'm missing something" }));
    });
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'characteristics',
      subStep: 0,
    });

    useOnboardingStore.setState({ stage: 'characteristics', subStep: 1 });
    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Yes' }));
    });
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'rating',
      subStep: 0,
    });
  });
});
