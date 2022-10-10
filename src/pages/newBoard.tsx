import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import { createBoard } from "../api/board";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { handlePromise } from "../utils";

type Props = NativeStackScreenProps<RootStackParamList, "NewBoard">;

const NewBoardScreen = ({ route }: Props) => {
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();
  const { tableId } = route.params;

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (boardName === "") return setError("Board name must not be empty");

    const [_, error] = await handlePromise(createBoard(boardName, tableId));

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
          Create a new Board
        </Text>
        {error.length > 0 && (
          <Text className="text-red-500 mb-2 text-left self-start ml-10">
            {error}
          </Text>
        )}
        <TextInput
          placeholder="Board name"
          className="bg-white px-4 py-3 rounded-lg mx-4 w-4/5"
          value={boardName}
          onChangeText={setBoardName}
        />
        <Button className="w-4/6 mt-5" onPress={handleSubmit}>
          Create
        </Button>
      </View>
    </View>
  );
};

export default NewBoardScreen;
