import {
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';


export default function animate (toValue, configs = undefined, onComplete) {
  'worklet';

  let handler = withSpring;

  if (
    typeof configs === 'object' &&
    ('duration' in configs || 'easing' in configs)
  ) {
    handler = withTiming;
  }

  return handler(toValue, configs, function (isFinished) {
    'worklet';
    if (onComplete) {
      runOnJS(onComplete)(isFinished);
    }
  });
};


