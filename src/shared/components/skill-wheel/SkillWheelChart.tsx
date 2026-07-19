import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, TSpan } from 'react-native-svg';

import type { Characteristic } from '@/domain/onboarding/types';
import { colors } from '@/shared/lib/theme';

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

const MAX_LABEL_LENGTH = 25;
const MISSING_SCORE_OPACITY = 0.3;

function truncateName(name: string): string {
  if (name.length <= MAX_LABEL_LENGTH) {
    return name;
  }

  return `${name.slice(0, MAX_LABEL_LENGTH - 1)}…`;
}

function isUsableScore(score: Characteristic['score']): score is number {
  return typeof score === 'number' && Number.isFinite(score);
}

function SkillWheelChartBase({
  characteristics,
  interactive = false,
  onWedgeTap,
  highlightIds = [],
  showWeakest = false,
  onFocusCtaPress,
}: SkillWheelChartProps) {
  const chartItems = useMemo(() => {
    if (characteristics.length > 12) {
      console.warn(
        `SkillWheelChart received ${characteristics.length} characteristics; more than 12 may make perimeter labels difficult to read.`,
      );
    }

    const wedgeAngle = characteristics.length > 0 ? 360 / characteristics.length : 0;

    return characteristics.map((characteristic, index) => {
      const startAngle = -90 + index * wedgeAngle;
      const endAngle = startAngle + wedgeAngle;
      const score = characteristic.score;
      const hasScore = isUsableScore(score);
      const colour = colourForIndex(index);

      return {
        characteristic,
        colour,
        endAngle,
        hasScore,
        index,
        label: truncateName(characteristic.name),
        outerRadius: hasScore ? scoreToRadius(score) : 0,
        startAngle,
      };
    });
  }, [characteristics]);

  const labelFontSize = characteristics.length >= 10 ? 11 : 13;
  const weakest = showWeakest
    ? chartItems.find(({ characteristic }) => characteristic.id === highlightIds[0])
    : undefined;

  if (characteristics.length === 0) {
    return (
      <View style={styles.emptyState}>
        <NativeText style={styles.emptyStateText}>No skill characteristics yet.</NativeText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          preserveAspectRatio="xMidYMid meet"
        >
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

          {chartItems.map(
            ({ characteristic, colour, endAngle, hasScore, index, outerRadius, startAngle }) => {
              const highlighted = highlightIds.includes(characteristic.id);

              return (
                <Path
                  key={`wedge-${characteristic.id}-${index}`}
                  d={wedgePath(CENTER, CENTER, 0, outerRadius, startAngle, endAngle)}
                  fill={hasScore ? colour : colors.bgOverlay}
                  fillOpacity={hasScore ? 0.5 : MISSING_SCORE_OPACITY}
                  stroke={hasScore ? colour : colors.textMuted}
                  strokeWidth={highlighted ? 2.5 : 1.5}
                  onPress={
                    interactive && onWedgeTap
                      ? () => onWedgeTap(characteristic.id)
                      : undefined
                  }
                />
              );
            },
          )}

          <Circle cx={CENTER} cy={CENTER} r={CENTER_DOT_R} fill={colors.textMuted} />

          {chartItems.map(({ characteristic, colour, hasScore, index, label }) => {
            const angle = -90 + (index + 0.5) * (360 / characteristics.length);
            const anchor = labelAnchor(CENTER, CENTER, MAX_RADIUS, angle);

            return (
              <SvgText
                key={`label-${characteristic.id}-${index}`}
                x={anchor.x}
                y={anchor.y}
                fill={colors.textSecondary}
                fontSize={labelFontSize}
                fontWeight={500}
                textAnchor={anchor.textAnchor}
                alignmentBaseline="middle"
              >
                {label}
                <TSpan
                  dx={4}
                  fill={hasScore ? colour : colors.textMuted}
                  fontWeight={700}
                >
                  {hasScore ? String(characteristic.score) : '—'}
                </TSpan>
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {weakest ? (
        <View style={styles.weakestCard}>
          <View style={styles.weakestHeading}>
            <NativeText style={styles.weakestHeadingText}>Weakest area</NativeText>
            <View style={styles.headingRule} />
          </View>
          <View style={styles.weakestValue}>
            <View style={[styles.weakestDot, { backgroundColor: weakest.colour }]} />
            <NativeText style={styles.weakestName}>{weakest.characteristic.name}</NativeText>
            <NativeText style={styles.weakestScore}>
              {weakest.hasScore ? `${weakest.characteristic.score} / 10` : '— / 10'}
            </NativeText>
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
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  weakestCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
  },
  weakestHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  weakestHeadingText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headingRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  weakestValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  weakestDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  weakestName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  weakestScore: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  focusButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: colors.accentPrimary,
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

export const SkillWheelChart = memo(SkillWheelChartBase);

export default SkillWheelChart;
