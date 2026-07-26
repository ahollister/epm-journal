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
import { CharacteristicDefinition } from './CharacteristicDefinition';

const threeLists = {
  who: ['Jazz guitarist', 'Band member'],
  why: {
    'Jazz guitarist': ['To improvise with confidence'],
    'Band member': ['To support the song'],
  },
  improvements: ['Keep steadier time', 'Develop a clearer tone'],
};

async function addCharacteristic(
  screen: Awaited<ReturnType<typeof render>>,
  name: string,
) {
  await act(() => {
    fireEvent.changeText(screen.getByLabelText('Characteristic name'), name);
  });
  await act(() => {
    fireEvent.press(screen.getByRole('button', { name: 'Add' }));
  });
}

describe('CharacteristicDefinition', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({ stage: 'characteristics', threeLists });
  });

  afterEach(async () => {
    await cleanup();
  });

  it('shows the Three Lists as read-only inspiration', async () => {
    const screen = await render(<CharacteristicDefinition />);

    expect(screen.getByText('Jazz guitarist')).toBeOnTheScreen();
    expect(screen.getByText('Jazz guitarist · To improvise with confidence')).toBeOnTheScreen();
    expect(screen.getByText('Keep steadier time')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Jazz guitarist' })).toBeNull();
  });

  it('adds trimmed names, rejects blank input, and permits duplicate names with a warning', async () => {
    const screen = await render(<CharacteristicDefinition />);
    const input = screen.getByLabelText('Characteristic name');
    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(input.props.placeholder).toContain('Name a broad area of your musicianship');
    expect(addButton).toBeDisabled();

    await act(() => {
      fireEvent.changeText(input, '   ');
    });
    expect(addButton).toBeDisabled();

    await addCharacteristic(screen, '  Tone quality  ');
    expect(screen.getByText('Tone quality')).toBeOnTheScreen();

    await addCharacteristic(screen, 'tone quality');
    expect(screen.getAllByText(/tone quality/i)).toHaveLength(3);
    expect(
      screen.getByText(
        "You already have a characteristic called 'tone quality'. Did you mean to combine them?",
      ),
    ).toBeOnTheScreen();
  });

  it('enforces the three-characteristic gate, warns after twelve, and advances within Stage 3', async () => {
    const screen = await render(<CharacteristicDefinition />);
    const nextButton = screen.getByRole('button', { name: 'Next' });

    expect(screen.getByText('Define at least 3 characteristics to continue.')).toBeOnTheScreen();
    expect(nextButton).toBeDisabled();

    await addCharacteristic(screen, 'Tone');
    await addCharacteristic(screen, 'Timing');
    await addCharacteristic(screen, 'Improvisation');

    expect(nextButton).toBeEnabled();
    expect(screen.getByText('Most musicians define 4–8 characteristics.')).toBeOnTheScreen();

    await act(() => fireEvent.press(nextButton));
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'characteristics',
      subStep: 1,
    });

    await act(() => {
      for (let index = 4; index <= 13; index += 1) {
        useOnboardingStore.getState().addCharacteristic(`Characteristic ${index}`);
      }
    });
    expect(
      screen.getByText(
        "That's a lot of dimensions — your wheel may be hard to read. Consider combining similar characteristics.",
      ),
    ).toBeOnTheScreen();
  });

  it('removes a characteristic from the growing list', async () => {
    const screen = await render(<CharacteristicDefinition />);
    await addCharacteristic(screen, 'Tone');

    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Remove Tone' }));
    });

    expect(screen.queryByText('Tone')).toBeNull();
    expect(useOnboardingStore.getState().characteristics).toEqual([]);
  });
});
