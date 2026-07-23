import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import type { Characteristic } from '@/domain/onboarding/types';
import { colors } from '@/shared/lib/theme';

export interface SkillWheelChartProps {
  characteristics: Characteristic[];
  interactive?: boolean;
  onWedgeTap?: (characteristicId: string) => void;
}

const VIEWBOX_SIZE = 360;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RADIUS = 132;
const LABEL_RADIUS = 158;
const RING_SCORES = [2, 4, 6, 8, 10];
const WHEEL_COLORS = [
  colors.wheel.tone,
  colors.wheel.timing,
  colors.wheel.technique,
  colors.wheel.repertoire,
  colors.wheel.improvisation,
  colors.wheel.earTraining,
];

function polarPoint(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(radians) * radius,
    y: CENTER + Math.sin(radians) * radius,
  };
}

function wedgePath(startAngle: number, endAngle: number, radius: number) {
  const start = polarPoint(radius, startAngle);
  const end = polarPoint(radius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function scoreRadius(score: number | undefined) {
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(10, score)) / 10 * MAX_RADIUS;
}

function labelAnchor(angle: number) {
  const point = polarPoint(LABEL_RADIUS, angle);
  const cosine = Math.cos((angle * Math.PI) / 180);

  return {
    ...point,
    textAnchor: cosine > 0.35 ? 'start' : cosine < -0.35 ? 'end' : 'middle',
  } as const;
}

function SkillWheelChartBase({
  characteristics,
  interactive = false,
  onWedgeTap,
}: SkillWheelChartProps) {
  if (characteristics.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No skill characteristics yet.</Text>
      </View>
    );
  }

  const wedgeAngle = 360 / characteristics.length;

  return (
    <View style={styles.container}>
      <Svg
        accessibilityLabel="Skill wheel chart"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        width="100%"
      >
        {RING_SCORES.map((ringScore) => (
          <Circle
            key={`ring-${ringScore}`}
            cx={CENTER}
            cy={CENTER}
            fill="none"
            r={scoreRadius(ringScore)}
            stroke={colors.borderSubtle}
            strokeWidth={1}
          />
        ))}

        {characteristics.map((characteristic, index) => {
          const startAngle = -90 + index * wedgeAngle + 2;
          const endAngle = -90 + (index + 1) * wedgeAngle - 2;
          const fill = WHEEL_COLORS[index % WHEEL_COLORS.length];

          return (
            <Path
              key={characteristic.id}
              accessibilityLabel={`${characteristic.name}, score ${characteristic.score ?? 'not rated'}`}
              d={wedgePath(startAngle, endAngle, scoreRadius(characteristic.score))}
              fill={fill}
              fillOpacity={0.62}
              onPress={
                interactive && onWedgeTap
                  ? () => onWedgeTap(characteristic.id)
                  : undefined
              }
              stroke={fill}
              strokeWidth={1.5}
            />
          );
        })}

        {characteristics.map((characteristic, index) => {
          const angle = -90 + (index + 0.5) * wedgeAngle;
          const label = labelAnchor(angle);

          return (
            <SvgText
              key={`label-${characteristic.id}`}
              alignmentBaseline="middle"
              fill={colors.textSecondary}
              fontSize={characteristics.length > 8 ? 10 : 12}
              textAnchor={label.textAnchor}
              x={label.x}
              y={label.y}
            >
              {characteristic.name}
            </SvgText>
          );
        })}

        <Circle cx={CENTER} cy={CENTER} fill={colors.textMuted} r={3} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
    borderWidth: 1,
    justifyContent: 'center',
    width: '100%',
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});

export const SkillWheelChart = memo(SkillWheelChartBase);

export default SkillWheelChart;
