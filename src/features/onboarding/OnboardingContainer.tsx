import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { type Stage } from '@/domain/onboarding/stages';
import { useOnboardingStore } from '@/features/onboarding/store';
import { ProgressChrome } from '@/features/onboarding/components/ProgressChrome';
import {
  Characteristics,
  Complete,
  Confirm,
  Focus,
  ImprovementsList,
  Intro,
  Rating,
  WhoList,
  WhyList,
} from '@/features/onboarding/stages';
import { colors } from '@/shared/lib/theme';

function renderStage(stage: Stage, subStep: number) {
  switch (stage) {
    case 'intro':
      return <Intro />;
    case 'threeLists':
      if (subStep === 0) return <WhoList />;
      if (subStep === 1) return <WhyList />;
      return <ImprovementsList />;
    case 'characteristics':
      return <Characteristics />;
    case 'rating':
      return <Rating />;
    case 'confirm':
      return <Confirm />;
    case 'focus':
      return <Focus />;
    case 'complete':
      return <Complete />;
  }
}

export function OnboardingContainer() {
  const stage = useOnboardingStore((state) => state.stage);
  const subStep = useOnboardingStore((state) => state.subStep);
  const back = useOnboardingStore((state) => state.back);
  const hasProgressChrome = stage !== 'intro' && stage !== 'complete';

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (stage === 'intro') {
          return false;
        }

        back();
        return true;
      },
    );

    return () => subscription.remove();
  }, [back, stage]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {hasProgressChrome ? <ProgressChrome /> : null}
      <View style={styles.stageContent}>{renderStage(stage, subStep)}</View>
    </View>
  );
}

export default OnboardingContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  stageContent: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
});
