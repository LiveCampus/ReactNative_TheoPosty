import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RootStackParamList } from "../../App";
import { getBoard, getBoards, updateBoard } from "../api/board";
import { getTask, getTasks, getTaskTable, updateTask } from "../api/task";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import TableLoading from "../components/Table/TableLoading";
import { handlePromise } from "../utils";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateTask">;

const UpdateTaskScreen = ({ route }: Props) => {
  const [task, setTask] = useState<any>({});
  const [tasks, setTasks] = useState<any[]>();
  const [boards, setBoards] = useState<any[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);

  const navigation = useNavigation<any>();
  const { taskId } = route.params;

  useEffect(() => {
    (async () => {
      const task = await getTask(taskId);
      const tasks = await getTasks(task.boardId);
      const tableId = await getTaskTable(taskId);
      const boards = await getBoards(tableId);

      setTask(task);
      setTasks(tasks);
      setBoards(boards);

      setLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (task.name === "") return setError("Task name must not be empty");

    const [_, error] = await handlePromise(updateTask(taskId, task));

    if (error) {
      return setError(error.message);
    }

    navigation.replace("Home", { screen: "Dashboard" });
  };

  return (
    <View className="py-10">
      <View className="flex flex-row">
        <IconButton
          name="arrow-back"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Header />
      </View>
      {loading ? (
        <TableLoading />
      ) : (
        <View className="flex justify-center items-center h-full">
          <Text className="text-xl font-bold text-center mb-4">
            Update Task
          </Text>
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 text-left self-start ml-10">
              {error}
            </Text>
          )}
          <View className="flex justify-center w-4/5">
            <Text className="mb-2 self-start px-7">Name :</Text>
            <TextInput
              placeholder="Task name"
              className="bg-white px-4 py-3 rounded-lg mb-2"
              value={task.name}
              onChangeText={(v) => setTask({ ...task, name: v })}
            />
            <Text className="mb-2 self-start px-7">
              Order : (position of the task in the list before drag and drop
              implementation)
            </Text>
            <DropDownPicker
              items={[...Array(tasks?.length)].map((_, i) => ({
                label: `${i + 1}`,
                value: i,
              }))}
              open={orderOpen}
              setOpen={setOrderOpen}
              setValue={(v) =>
                setTask((task: any) => ({ ...task, order: v(task.order) }))
              }
              value={task.order}
              style={{ marginBottom: 8 }}
            />
            <Text className="mb-2 self-start px-7">
              Board : (Board in which the task is located before drag and drop
              implementation)
            </Text>
            <DropDownPicker
              items={(boards || []).map((board, i) => ({
                label: board.name,
                value: board.id,
              }))}
              open={boardOpen}
              setOpen={setBoardOpen}
              setValue={(v) =>
                setTask((task: any) => ({ ...task, boardId: v(task.boardId) }))
              }
              value={task.boardId}
              style={{ marginBottom: 8, zIndex: 0 }}
            />
          </View>
          <Button className="w-4/6 mt-5" onPress={handleSubmit}>
            Update
          </Button>
        </View>
      )}
    </View>
  );
};

export default UpdateTaskScreen;
