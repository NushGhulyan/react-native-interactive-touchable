import React from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  interpolate,
  useWorkletCallback,
  useAnimatedReaction,
} from 'react-native-reanimated';

import animate from './animate';

import { Pressable } from 'react-native';

function TouchableInteractive({
  children,

  defaultScale = 1,
  activeScale = 0.95,

  activeOpacity = 1,

  onPressIn,
  onPressOut,

  animationConfigs,
  pressInAnimationConfigs,
  pressOutAnimationConfigs,

  onPressInAnimationEnd,
  onPressOutAnimationEnd,

  animatedProgress,

  ...props
}) {
  const progress = useSharedValue(0);

  useAnimatedReaction(
    () => progress.value,
    value => {
      if (animatedProgress) {
        animatedProgress.value = value;
      }
    },
    [animatedProgress],
  );

  const handlePressIn = useWorkletCallback(
    event => {
      progress.value = animate(
        1,
        pressInAnimationConfigs || animationConfigs,
        onPressInAnimationEnd,
      );
      if (onPressIn) {
        runOnJS(onPressIn)(event);
      }
    },
    [
      onPressIn,
      progress,
      animationConfigs,
      pressInAnimationConfigs,
      onPressInAnimationEnd,
    ],
  );

  const handlePressOut = useWorkletCallback(
    event => {
      progress.value = animate(
        0,
        pressOutAnimationConfigs || animationConfigs,
        onPressOutAnimationEnd,
      );
      if (onPressOut) {
        runOnJS(onPressOut)(event);
      }
    },
    [
      onPressOut,
      progress,
      animationConfigs,
      pressOutAnimationConfigs,
      onPressOutAnimationEnd,
    ],
  );

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [defaultScale, activeScale],
          ),
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [1, activeOpacity]),
    };
  }, [defaultScale, activeScale, activeOpacity]);

  return (
    <Pressable {...props} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}

export default TouchableInteractive;
