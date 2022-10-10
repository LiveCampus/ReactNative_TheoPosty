import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const BoardLoading = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    let fadeInAndOut = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]);

    Animated.loop(fadeInAndOut).start();
  }, []);

  return (
    <Animated.View
      className="h-24 px-3 py-2 rounded-lg space-y-1"
      style={[{ backgroundColor: `rgb(229, 231, 235)` }, { opacity: fadeAnim }]}
    />
  );
};

export default BoardLoading;
