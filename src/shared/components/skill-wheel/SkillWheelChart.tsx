import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import Svg, { Circle, Path, Text, TSpan } from 'react-native-svg';

import type { Characteristic } from '../../../domain/onboarding/types';
import { colors } from '../../lib/theme';
import {
  CENTER,
  CENTER_DOT_R,
  MAX_RADIUS,
  RING_SCORES,
  VIEWBOX,
  labelAnchor,
  scoreToRadius,
  wedgePath,
} from './geometry';
import { colourForIndex } from './palette';

export interface SkillWheelChartProps {
  characteristics: Characteristic[];
  interactive?: boolean;
  onWedgeTap?: (characteristicId: string) => void;
  highlightIds?: string[];
  showWeakest?: boolean;
  onFocusCtaPress?: () => void;
}

const LABEL_MAX_LENGTH = 25;
const WEDGE_FILL_OPACITY = 0.5;
const MUTED_WEDGE_OPACITY = 0.35;

type ChartGeometry = {
  id: string;
  path: string;
  name: string;
  score: number | undefined;
  scoreLabel: string;
  colour: string;
  label: ReturnType<typeof labelAnchor>;
};

function truncateLabel(name: string): string {
  if (name.length <= LABEL_MAX_LENGTH) {
    return name;
  }

  return `${name.slice(0, LABEL_MAX_LENGTH - 1)}…`;
}

function displayScore(score: number | undefined): string {
  return score == null || Number.isNaN(score) ? '—' : String(score);
}

function SkillWheelChartComponent({
  characteristics,
  interactive = false,
  onWedgeTap,
  highlightIds = [],
  showWeakest = false,
  onFocusCtaPress,
}: SkillWheelChartProps) {
  const geometry = useMemo<ChartGeometry[]>(() => {
    if (characteristics.length > 12) {
      console.warn(
        `SkillWheelChart received ${characteristics.length} characteristics; labels may overlap.`,
      );
    }

    const wedgeAngle = characteristics.length === 0 ? 0 : 360 / characteristics.length;

    return characteristics.map((characteristic, index) => {
      const hasScore = characteristic.score != null && !Number.isNaN(characteristic.score);
      const score = hasScore ? characteristic.score : undefined;
      const radius = hasScore ? scoreToRadius(score as number) : MAX_RADIUS;
      const startAngle = -90 + index * wedgeAngle;
      const endAngle = startAngle + wedgeAngle;

      return {
        id: characteristic.id,
        path: wedgePath(CENTER, CENTER, 0, radius, startAngle, endAngle),
        name: truncateLabel(characteristic.name),
        score,
        scoreLabel: displayScore(score),
        colour: hasScore ? colourForIndex(index) : colors.bgOverlay,
        label: labelAnchor(CENTER, CENTER, MAX_RADIUS, startAngle + wedgeAngle / 2),
      };
    });
  }, [characteristics]);

  if (characteristics.length === 0) {
    return (
      <View style={styles.emptyState}>
        <NativeText style={styles.emptyStateText}>Complete onboarding to see your skill wheel.</NativeText>
      </View>
    );
  }

  const weakestId = highlightIds[0];
  const weakest = characteristics.find((characteristic) => characteristic.id === weakestId);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          {RING_SCORES.map((ringScore, index) => (
            <Circle
              key={`ring-${ringScore}`}
              cx={CENTER}
              cy={CENTER}
              r={scoreToRadius(ringScore)}
              fill="none"
              stroke={index === RING_SCORES.length - 1 ? colors.borderStrong : colors.borderSubtle}
              strokeWidth={1}
            />
          ))}

          {geometry.map((wedge) => {
            const isHighlighted = highlightIds.includes(wedge.id);
            const isMuted = wedge.score === undefined;

            return (
              <Path
                key={wedge.id}
                d={wedge.path}
                fill={wedge.colour}
                fillOpacity={isMuted ? MUTED_WEDGE_OPACITY : WEDGE_FILL_OPACITY}
                stroke={wedge.colour}
                strokeOpacity={1}
                strokeWidth={isHighlighted ? 3 : 1.5}
                onPress={
                  interactive && onWedgeTap ? () => onWedgeTap(wedge.id) : undefined
                }
              />
            );
          })}

          <Circle cx={CENTER} cy={CENTER} r={CENTER_DOT_R} fill={colors.textMuted} />

          {geometry.map((wedge) => {
            const isHighlighted = highlightIds.includes(wedge.id);
            const labelFontSize = characteristics.length >= 10 ? 11 : 13;

            return (
              <Text
                key={`label-${wedge.id}`}
                x={wedge.label.x}
                y={wedge.label.y}
                fill={colors.textSecondary}
                fontSize={labelFontSize}
                fontWeight={isHighlighted ? 600 : 500}
                textAnchor={wedge.label.textAnchor}
                alignmentBaseline="middle"
                onPress={
                  interactive && onWedgeTap ? () => onWedgeTap(wedge.id) : undefined
                }
              >
                {wedge.name}{' '}
                <TSpan
                  fill={wedge.score === undefined ? colors.textMuted : wedge.colour}
                  fontWeight={700}
                >
                  {wedge.scoreLabel}
                </TSpan>
              </Text>
            );
          })}
        </Svg>
      </View>

      {showWeakest && weakest ? (
        <View style={styles.weakestCard}>
          <View style={styles.weakestHeadingRow}>
            <NativeText style={styles.weakestHeading}>Weakest area</NativeText>
            <View style={styles.headingRule} />
          </View>
          <View style={styles.weakestValueRow}>
            <View style={[styles.weakestDot, { backgroundColor: colourForIndex(characteristics.indexOf(weakest)) }]} />
            <NativeText style={styles.weakestName}>{weakest.name}</NativeText>
            <NativeText style={styles.weakestScore}>{displayScore(weakest.score)} / 10</NativeText>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={!onFocusCtaPress}
            onPress={onFocusCtaPress}
            style={({ pressed }) => [styles.focusButton, pressed && styles.focusButtonPressed]}
          >
            <NativeText style={styles.focusButtonText}>Focus next session</NativeText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartWrapper: {
    width: '100%',
    aspectRatio: 1,
  },
  emptyState: {
    alignItems: 'center',
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 120,
    padding: 16,
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  weakestCard: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    padding: 16,
  },
  weakestHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  weakestHeading: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headingRule: {
    backgroundColor: colors.borderSubtle,
    flex: 1,
    height: 1,
  },
  weakestValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  weakestDot: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  weakestName: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  weakestScore: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  focusButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: 9999,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 24,
  },
  focusButtonPressed: {
    opacity: 0.8,
  },
  focusButtonText: {
    color: colors.accentOn,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export const SkillWheelChart = memo(SkillWheelChartComponent);

export default SkillWheelChart;
