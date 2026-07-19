import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
  TSpan,
} from 'react-native-svg';

import type { Characteristic } from '@/domain/onboarding/types';
import { colors, radius, space } from '@/shared/lib/theme';

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
      const midAngle = startAngle + wedgeAngle / 2;

      return {
        anchor: labelAnchor(CENTER, CENTER, MAX_RADIUS, midAngle),
        characteristic,
        colour,
        endAngle,
        hasScore,
        index,
        label: truncateName(characteristic.name),
        outerRadius: hasScore ? scoreToRadius(score) : MAX_RADIUS,
        startAngle,
      };
    });
  }, [characteristics]);

  const labelFontSize = characteristics.length >= 10 ? 11 : 13;
  const weakestCharacteristic = showWeakest
    ? characteristics.find((characteristic) => characteristic.id === highlightIds[0])
    : undefined;
  const weakestIndex = weakestCharacteristic
    ? characteristics.indexOf(weakestCharacteristic)
    : -1;
  const weakestColour = weakestIndex >= 0 ? colourForIndex(weakestIndex) : colors.textMuted;

  return (
    <View style={styles.container}>
      {characteristics.length === 0 ? (
        <View style={styles.emptyState}>
          <NativeText style={styles.emptyStateText}>No skill characteristics yet.</NativeText>
        </View>
      ) : (
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

            {chartItems.map(({ anchor, characteristic, colour, hasScore, index, label }) => (
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
                <TSpan dx={4} fill={hasScore ? colour : colors.textMuted} fontWeight={700}>
                  {hasScore ? String(characteristic.score) : '—'}
                </TSpan>
              </SvgText>
            ))}
          </Svg>
        </View>
      )}

      {showWeakest ? (
        <View style={styles.weakestCard}>
          <View style={styles.weakestHeading}>
            <NativeText style={styles.weakestHeadingText}>WEAKEST AREA</NativeText>
            <View style={styles.headingRule} />
          </View>

          {weakestCharacteristic ? (
            <>
              <View style={styles.weakestValue}>
                <View style={[styles.weakestDot, { backgroundColor: weakestColour }]} />
                <NativeText style={styles.weakestName}>{weakestCharacteristic.name}</NativeText>
                <NativeText style={styles.weakestScore}>
                  {isUsableScore(weakestCharacteristic.score)
                    ? `${weakestCharacteristic.score} / 10`
                    : '— / 10'}
                </NativeText>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onFocusCtaPress}
                style={({ pressed }) => [styles.focusButton, pressed && styles.focusButtonPressed]}
              >
                <Svg
                  pointerEvents="none"
                  style={StyleSheet.absoluteFill}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                >
                  <Defs>
                    <LinearGradient id="weakest-cta-gradient" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor={colors.accentPrimary} />
                      <Stop offset="1" stopColor={colors.accentHover} />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx={radius.full}
                    fill="url(#weakest-cta-gradient)"
                  />
                </Svg>
                <NativeText style={styles.focusButtonText}>Focus next session</NativeText>
              </Pressable>
            </>
          ) : (
            <NativeText style={styles.noWeakestText}>No data yet</NativeText>
          )}
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
    marginTop: space.lg,
    padding: space.base,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
  },
  weakestHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.md,
  },
  weakestHeadingText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
  },
  headingRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSubtle,
  },
  weakestValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.base,
  },
  weakestDot: {
    width: 10,
    height: 10,
    borderRadius: radius.xs,
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
  },
  focusButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: space.lg,
    borderRadius: radius.full,
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
  noWeakestText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});

export const SkillWheelChart = memo(SkillWheelChartBase);

export default SkillWheelChart;
