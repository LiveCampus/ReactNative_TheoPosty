import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { getBoard } from "../api/board";
import { addImage, deleteImage, getTask } from "../api/task";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import TableLoading from "../components/Table/TableLoading";
import * as ImagePicker from "expo-image-picker";
import GridImage from "../components/GridImage";

type Props = NativeStackScreenProps<RootStackParamList, "Task">;

const TaskScreen = ({ route }: Props) => {
  const navigation = useNavigation<any>();
  const { taskId } = route.params;

  const [task, setTask] = useState<any>();
  const [board, setBoard] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [refreshValue, setRefreshValue] = useState(0);

  useEffect(() => {
    (async () => {
      const task = await getTask(taskId);
      const board = await getBoard(task.boardId);

      setTask(task);
      setBoard(board);

      setLoading(false);
    })();
  }, [refreshValue]);

  const selectImage = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    if (image.cancelled) return;

    await addImage(task.id, image.uri);
    setRefreshValue(Math.random);
  };

  const handleDelete = async (uri: string) => {
    await deleteImage(task.id, uri);
    setRefreshValue(Math.random);
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
        <View>
          <View className="flex justify-center mx-14 mt-40">
            <View className="flex flex-row space-x-2">
              <Text className="font-semibold text-xl text-gray-600">ID:</Text>
              <Text className="text-gray-400 text-lg">{task.id}</Text>
            </View>
            <View className="flex flex-row space-x-2">
              <Text className="font-semibold text-xl text-gray-600">
                Title:
              </Text>
              <Text className="text-gray-400 text-lg">{task.name}</Text>
            </View>
            <View className="flex flex-row space-x-2">
              <Text className="font-semibold text-xl text-gray-600">
                Board:
              </Text>
              <Text className="text-gray-400 text-lg">{board.name}</Text>
            </View>
          </View>
          <View>
            <View className="flex flex-row items-center justify-center space-x-1">
              <Text className="font-semibold text-xl text-gray-600 text-center mt-3">
                Images
              </Text>
              <IconButton
                name="add-circle-outline"
                className="mt-4"
                onPress={selectImage}
              />
            </View>
            <View className="h-96">
              <GridImage data={task.images} handleDelete={handleDelete} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskScreen;
