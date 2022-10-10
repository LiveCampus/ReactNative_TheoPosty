import { useNavigation } from "@react-navigation/native";
import { forwardRef, useRef, useState } from "react";
import { Alert, ViewProps } from "react-native";
import { PanResponder } from "react-native";
import { Animated, StyleSheet, Text, View } from "react-native";
import { deleteTask } from "../../api/task";
import IconButton from "../IconButton";

interface Props extends ViewProps {
  id: string;
  title: string;
  order: number;
  refresh: () => void;
}

const Task = forwardRef<View, Props>(
  ({ id, title, order, style, refresh, ...props }, ref) => {
    const sizeAnim = useRef(new Animated.Value(1)).current;
    const pan = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<any>();

    const [z, setZ] = useState(1);

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { moveX, moveY, dx, dy }) => {
          return dy > 10 || dy < -10;
        },
        onPanResponderGrant: () => {
          Animated.timing(sizeAnim, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: false,
          }).start();
          setZ(100);
        },
        onPanResponderMove: Animated.event([null, { dy: pan }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => setZ(1));
          Animated.timing(sizeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        },
      })
    ).current;

    const handleDelete = () => {
      Alert.alert("You're about to delete a task", title, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            await deleteTask(id);
            refresh();
          },
        },
      ]);
    };

    const handleUpdate = () => {
      navigation.navigate("UpdateTask", { taskId: id });
    };

    return (
      <Animated.View
        ref={ref}
        className="bg-white h-12 px-3 py-2 rounded-lg flex flex-row justify-between items-center"
        style={[
          style,
          styles.shadow,
          {
            transform: [{ translateY: pan }, { scale: sizeAnim }],
            zIndex: z,
          },
        ]}
        {...props}
        {...panResponder.panHandlers}
      >
        <View className="flex flex-row space-x-3 w-8/12">
          <Text className="text-gray-300 font-bold">{order}</Text>
          <Text
            className="font-bold text-gray-600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
        <View className="flex flex-row space-x-1">
          <IconButton
            name="ios-pencil"
            className="bg-amber-600"
            iconColor="white"
            onPress={handleUpdate}
          />
          <IconButton
            name="trash-outline"
            className="bg-red-500"
            iconColor="white"
            onPress={handleDelete}
          />
          <IconButton
            name="eye"
            className="bg-blue-500"
            iconColor="white"
            onPress={() =>
              navigation.navigate("Task", {
                taskId: id,
              })
            }
          />
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Task;
