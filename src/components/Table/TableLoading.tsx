import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const TableLoading = () => {
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
    <View className="py-3 w-screen flex items-center h-full">
      <Animated.View
        className="w-11/12 px-3 rounded-lg h-5/6"
        style={[
          { backgroundColor: `rgb(229, 231, 235)` },
          { opacity: fadeAnim },
        ]}
      />
    </View>
  );
};

export default TableLoading;
