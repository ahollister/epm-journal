import { act, render, screen } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { ProgressChrome } from './ProgressChrome';
import { useOnboardingStore } from '@/features/onboarding/store';

const characteristic = {
  id: 'characteristic-1',
  name: 'Timing',
  order: 1,
};

async function setOnboardingState(
  state: Partial<Pick<ReturnType<typeof useOnboardingStore.getState>, 'stage' | 'subStep' | 'characteristics'>>,
) {
  await act(async () => {
    useOnboardingStore.setState(state);
  });
}

afterEach(async () => {
  await act(async () => {
    useOnboardingStore.getState().reset();
  });
});

describe('ProgressChrome', () => {
  it.each([
    ['threeLists', 0, [], 'List 1 of 3'],
    ['characteristics', 1, [characteristic], 'Characteristic 2 of 1'],
    ['rating', 0, [characteristic, { ...characteristic, id: 'characteristic-2' }], 'Characteristic 1 of 2'],
    ['confirm', 0, [], 'Step 5 of 7'],
    ['focus', 0, [], 'Step 6 of 7'],
  ] as const)('shows the correct label during %s', async (stage, subStep, characteristics, label) => {
    await setOnboardingState({ stage, subStep, characteristics: [...characteristics] });

    await render(<ProgressChrome />);

    expect(screen.getByText(label)).toBeTruthy();
  });

  it.each(['intro', 'complete'] as const)('renders nothing during %s', async (stage) => {
    await setOnboardingState({ stage });

    await render(<ProgressChrome />);

    expect(screen.queryByText(/.+/)).toBeNull();
  });

  it('refreshes when the subscribed store state changes', async () => {
    await setOnboardingState({ stage: 'threeLists', subStep: 0 });
    await render(<ProgressChrome />);

    expect(screen.getByText('List 1 of 3')).toBeTruthy();

    await setOnboardingState({ subStep: 1 });

    expect(screen.getByText('List 2 of 3')).toBeTruthy();
  });
});
