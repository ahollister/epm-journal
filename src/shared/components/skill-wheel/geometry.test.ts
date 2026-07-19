import {
  CENTER,
  MAX_RADIUS,
  RING_SCORES,
  hitWedgePath,
  labelAnchor,
  scoreToRadius,
  wedgePath,
} from './geometry';

describe('wedgePath', () => {
  it.each([
    ['12 o’clock to 3 o’clock', -90, 0, 'M 180 180 L 180 40 A 140 140 0 0 1 320 180 Z'],
    ['3 o’clock to 6 o’clock', 0, 90, 'M 180 180 L 320 180 A 140 140 0 0 1 180 320 Z'],
    ['6 o’clock to 9 o’clock', 90, 180, 'M 180 180 L 180 320 A 140 140 0 0 1 40 180 Z'],
    ['9 o’clock to 12 o’clock', 180, 270, 'M 180 180 L 40 180 A 140 140 0 0 1 180 40 Z'],
  ])('%s follows the clockwise N=4 geometry', (_name, start, end, expected) => {
    expect(wedgePath(CENTER, CENTER, 0, MAX_RADIUS, start, end)).toBe(expected);
  });

  it('creates an annular sector when an inner radius is supplied', () => {
    expect(wedgePath(CENTER, CENTER, 14, 42, -90, 0)).toBe(
      'M 180 138 A 42 42 0 0 1 222 180 L 194 180 A 14 14 0 0 0 180 166 Z',
    );
  });
});

describe('scoreToRadius', () => {
  it.each([
    [0, 0],
    [5, 70],
    [10, 140],
    [11, 140],
    [-1, 0],
  ])('maps score %s to radius %s', (score, expected) => {
    expect(scoreToRadius(score)).toBe(expected);
  });
});

describe('ring radii', () => {
  it('maps the reference ring scores to the default radii', () => {
    expect(RING_SCORES.map(scoreToRadius)).toEqual([14, 42, 84, 112, 140]);
  });
});

describe('hitWedgePath', () => {
  it('uses the maximum radius for the invisible touch sector', () => {
    expect(hitWedgePath(CENTER, CENTER, -90, 0)).toBe(
      wedgePath(CENTER, CENTER, 0, MAX_RADIUS, -90, 0),
    );
  });
});

describe('labelAnchor', () => {
  it.each([
    [-90, { x: 180, y: 20, textAnchor: 'middle' }],
    [0, { x: 340, y: 180, textAnchor: 'start' }],
    [90, { x: 180, y: 340, textAnchor: 'middle' }],
    [180, { x: 20, y: 180, textAnchor: 'end' }],
  ])('anchors the label at %s degrees', (angle, expected) => {
    expect(labelAnchor(CENTER, CENTER, MAX_RADIUS, angle)).toEqual(expected);
  });
});
