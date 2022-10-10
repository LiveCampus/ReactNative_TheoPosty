import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import { createTask } from "../api/task";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { handlePromise } from "../utils";

type Props = NativeStackScreenProps<RootStackParamList, "NewTask">;

const NewTaskScreen = ({ route }: Props) => {
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();
  const { boardId } = route.params;

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (taskName === "") return setError("Task name must not be empty");

    const [_, error] = await handlePromise(createTask(taskName, boardId));

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
      <View className="flex justify-center items-center h-full">
        <Text className="text-xl font-bold text-center mb-4">
          Create a new Task
        </Text>
        {error.length > 0 && (
          <Text className="text-red-500 mb-2 text-left self-start ml-10">
            {error}
          </Text>
        )}
        <TextInput
          placeholder="Task name"
          className="bg-white px-4 py-3 rounded-lg mx-4 w-4/5"
          value={taskName}
          onChangeText={setTaskName}
        />
        <Button className="w-4/6 mt-5" onPress={handleSubmit}>
          Create
        </Button>
      </View>
    </View>
  );
};

export default NewTaskScreen;
