import { useNavigation } from "@react-navigation/native";
import { forwardRef, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, ViewProps } from "react-native";
import { deleteBoard } from "../../api/board";
import { getTasks } from "../../api/task";
import IconButton from "../IconButton";
import Popup from "../Popup";
import Task from "../Task/Task";
import TaskLoading from "../Task/TaskLoading";

interface Props extends ViewProps {
  title: string;
  id: string;
  refresh: () => void;
}

const Board = forwardRef<View, Props>(
  ({ title, id, style, refresh, ...props }, ref) => {
    const navigation = useNavigation<any>();

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);
    const [refreshValue, setRefreshValue] = useState(0);

    useEffect(() => {
      (async () => {
        const tasks = await getTasks(id);

        setTasks(tasks);
        setLoading(false);
      })();
    }, [refreshValue]);

    const refreshTasks = () => {
      setRefreshValue(Math.random);
    };

    const handleDelete = () => {
      Alert.alert("You're about to delete a board and all it's tasks", title, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            await deleteBoard(id);
            refresh();
          },
        },
      ]);
    };

    const handleUpdate = () => {
      navigation.navigate("UpdateBoard", { boardId: id });
    };

    return (
      <View
        ref={ref}
        className="w-full rounded-lg bg-white px-4 py-3"
        style={[style, styles.shadow]}
        {...props}
      >
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-xl font-bold">{title}</Text>
            <Text className="text-xl text-gray-300 font-bold">
              {tasks.length}
            </Text>
            <IconButton
              name="add-circle-outline"
              size={20}
              iconColor="#1f2937"
              onPress={() => {
                navigation.navigate("NewTask", {
                  boardId: id,
                });
              }}
            />
          </View>
          <Popup updateCallback={handleUpdate} deleteCallback={handleDelete} />
        </View>
        <View className="mt-3 space-y-1">
          {loading ? (
            <TaskLoading />
          ) : tasks.length === 0 ? (
            <Text className="text-gray-400 font-bold">
              There is no task here ¯\_(ツ)_/¯
            </Text>
          ) : (
            tasks.length > 0 &&
            tasks
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((task, i) => (
                <Task
                  id={task.id}
                  order={task.order + 1}
                  title={task.name}
                  key={i}
                  refresh={refreshTasks}
                />
              ))
          )}
        </View>
      </View>
    );
  }
);

export default Board;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
