import { fireEvent, render } from '@testing-library/react-native';

import type { Characteristic } from '../../../domain/onboarding/types';
import SkillWheelChart from './SkillWheelChart';

const characteristics: Characteristic[] = [
  { id: 'focus', name: 'Focus', order: 0, score: 2 },
  { id: 'energy', name: 'Energy', order: 1, score: 8 },
];

describe('SkillWheelChart wedge interaction', () => {
  it('uses full-radius hit sectors to tap the matching characteristic', async () => {
    const onWedgeTap = jest.fn();
    const { getByTestId } = await render(
      <SkillWheelChart
        characteristics={characteristics}
        interactive
        onWedgeTap={onWedgeTap}
      />,
    );
    const hitPath = getByTestId('skill-wheel-hit-energy');

    await fireEvent.press(hitPath);

    expect(onWedgeTap).toHaveBeenCalledWith('energy');
  });

  it('bumps the pressed wedge opacity and restores it on release', async () => {
    const { getByTestId } = await render(
      <SkillWheelChart characteristics={characteristics} interactive />,
    );
    const hitPath = getByTestId('skill-wheel-hit-focus');
    const wedgePathNode = getByTestId('skill-wheel-wedge-focus');

    expect(wedgePathNode.props.fillOpacity).toBe(0.5);

    await fireEvent(hitPath, 'pressIn');
    expect(getByTestId('skill-wheel-wedge-focus').props.fillOpacity).toBe(0.75);

    await fireEvent(hitPath, 'pressOut');
    expect(getByTestId('skill-wheel-wedge-focus').props.fillOpacity).toBe(0.5);
  });

  it('keeps wedges display-only when interactive mode is disabled', async () => {
    const onWedgeTap = jest.fn();
    const { queryAllByTestId } = await render(
      <SkillWheelChart characteristics={characteristics} onWedgeTap={onWedgeTap} />,
    );

    expect(queryAllByTestId(/skill-wheel-hit-/)).toHaveLength(0);
  });
});
