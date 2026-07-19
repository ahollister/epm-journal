export const VIEWBOX = 360;
export const CENTER = 180;
export const MAX_RADIUS = 140;
export const CENTER_DOT_R = 3;
export const RING_SCORES = [1, 3, 6, 8, 10] as const;

const LABEL_OFFSET = 20;
const DEGREES_TO_RADIANS = Math.PI / 180;

type Point = { x: number; y: number };

function pointOnCircle(centerX: number, centerY: number, radius: number, angleDeg: number): Point {
  const angleRad = angleDeg * DEGREES_TO_RADIANS;

  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

/** Maps a 0–10 score to a radius, clamping values outside the chart bounds. */
export function scoreToRadius(score: number): number {
  if (Number.isNaN(score)) {
    return 0;
  }

  return (Math.max(0, Math.min(10, score)) / 10) * MAX_RADIUS;
}

/**
 * Creates an SVG annular-sector path. Angles use screen coordinates: increasing
 * degrees move clockwise, with -90 degrees at 12 o'clock.
 */
export function wedgePath(
  centerX: number,
  centerY: number,
  innerR: number,
  outerR: number,
  startAngleDeg: number,
  endAngleDeg: number,
): string {
  const outerStart = pointOnCircle(centerX, centerY, outerR, startAngleDeg);
  const outerEnd = pointOnCircle(centerX, centerY, outerR, endAngleDeg);
  const sweep = endAngleDeg - startAngleDeg;
  const isFullCircle = Math.abs(sweep) >= 360;
  const largeArcFlag = Math.abs(sweep) > 180 ? 1 : 0;

  if (innerR === 0) {
    if (isFullCircle) {
      const outerMid = pointOnCircle(centerX, centerY, outerR, startAngleDeg + sweep / 2);

      return [
        `M ${formatNumber(centerX)} ${formatNumber(centerY)}`,
        `L ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
        `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 0 1 ${formatNumber(outerMid.x)} ${formatNumber(outerMid.y)}`,
        `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 0 1 ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
        'Z',
      ].join(' ');
    }

    return [
      `M ${formatNumber(centerX)} ${formatNumber(centerY)}`,
      `L ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
      `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 ${largeArcFlag} 1 ${formatNumber(outerEnd.x)} ${formatNumber(outerEnd.y)}`,
      'Z',
    ].join(' ');
  }

  const innerEnd = pointOnCircle(centerX, centerY, innerR, endAngleDeg);
  const innerStart = pointOnCircle(centerX, centerY, innerR, startAngleDeg);

  if (isFullCircle) {
    const outerMid = pointOnCircle(centerX, centerY, outerR, startAngleDeg + sweep / 2);
    const innerMid = pointOnCircle(centerX, centerY, innerR, startAngleDeg + sweep / 2);

    return [
      `M ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
      `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 0 1 ${formatNumber(outerMid.x)} ${formatNumber(outerMid.y)}`,
      `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 0 1 ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
      `L ${formatNumber(innerStart.x)} ${formatNumber(innerStart.y)}`,
      `A ${formatNumber(innerR)} ${formatNumber(innerR)} 0 0 0 ${formatNumber(innerMid.x)} ${formatNumber(innerMid.y)}`,
      `A ${formatNumber(innerR)} ${formatNumber(innerR)} 0 0 0 ${formatNumber(innerStart.x)} ${formatNumber(innerStart.y)}`,
      'Z',
    ].join(' ');
  }

  return [
    `M ${formatNumber(outerStart.x)} ${formatNumber(outerStart.y)}`,
    `A ${formatNumber(outerR)} ${formatNumber(outerR)} 0 ${largeArcFlag} 1 ${formatNumber(outerEnd.x)} ${formatNumber(outerEnd.y)}`,
    `L ${formatNumber(innerEnd.x)} ${formatNumber(innerEnd.y)}`,
    `A ${formatNumber(innerR)} ${formatNumber(innerR)} 0 ${largeArcFlag} 0 ${formatNumber(innerStart.x)} ${formatNumber(innerStart.y)}`,
    'Z',
  ].join(' ');
}

/** Full-radius sector used as the touch target for a wedge. */
export function hitWedgePath(
  centerX: number,
  centerY: number,
  startAngleDeg: number,
  endAngleDeg: number,
): string {
  return wedgePath(centerX, centerY, 0, MAX_RADIUS, startAngleDeg, endAngleDeg);
}

export function labelAnchor(
  centerX: number,
  centerY: number,
  radius: number,
  midAngleDeg: number,
): { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' } {
  const labelPoint = pointOnCircle(centerX, centerY, radius + LABEL_OFFSET, midAngleDeg);
  const horizontalDirection = Math.cos(midAngleDeg * DEGREES_TO_RADIANS);
  const textAnchor =
    Math.abs(horizontalDirection) < 0.1
      ? 'middle'
      : horizontalDirection > 0
        ? 'start'
        : 'end';

  return {
    x: Math.round(labelPoint.x * 100) / 100,
    y: Math.round(labelPoint.y * 100) / 100,
    textAnchor,
  };
}
