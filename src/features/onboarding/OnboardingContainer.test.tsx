import { act, render } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

import { OnboardingContainer } from './OnboardingContainer';
import { useOnboardingStore } from './store';

jest.mock('./stages', () => ({
  Characteristics: () => null,
  Complete: () => null,
  Confirm: () => null,
  Focus: () => null,
  ImprovementsList: () => null,
  Rating: () => null,
  WhoList: () => null,
  WhyList: () => null,
}));

jest.mock('./stages/IntroScreen', () => ({
  IntroScreen: () => null,
}));

describe('OnboardingContainer navigation guard', () => {
  const remove = jest.fn();
  let hardwareBackPress: (() => boolean | null | undefined) | undefined;

  beforeEach(() => {
    useOnboardingStore.getState().reset();
    remove.mockClear();
    hardwareBackPress = undefined;
    jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((_eventName, handler) => {
        hardwareBackPress = handler;
        return { remove };
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lets the intro dismiss normally and consumes back elsewhere', async () => {
    const screen = await render(<OnboardingContainer />);

    expect(hardwareBackPress?.()).toBe(false);

    await act(() => {
      useOnboardingStore.setState({ stage: 'threeLists', subStep: 2 });
    });

    let wasHandled: boolean | null | undefined;
    await act(() => {
      wasHandled = hardwareBackPress?.();
    });
    expect(wasHandled).toBe(true);
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'threeLists',
      subStep: 1,
    });

    await act(() => {
      hardwareBackPress?.();
      hardwareBackPress?.();
    });
    expect(useOnboardingStore.getState()).toMatchObject({
      stage: 'intro',
      subStep: 0,
    });

    await screen.unmount();
    expect(remove).toHaveBeenCalled();
  });
});
