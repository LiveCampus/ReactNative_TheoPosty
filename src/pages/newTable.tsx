import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { createTable } from "../api/table";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { handlePromise } from "../utils";

const NewTableScreen = () => {
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (tableName === "") return setError("Table name must not be empty");

    const [_, error] = await handlePromise(createTable(tableName, user.uid));

    if (error) {
      return setError(error.message);
    }

    navigation.replace("Home", { screen: "Dashboard" });
  };

  return (
    <View className="py-10">
      <View>
        <Header />
      </View>
      <View className="flex justify-center items-center h-full">
        <Text className="text-xl font-bold text-center mb-4">
          Create a new Table
        </Text>
        {error.length > 0 && (
          <Text className="text-red-500 mb-2 text-left self-start ml-10">
            {error}
          </Text>
        )}
        <TextInput
          placeholder="Table name"
          className="bg-white px-4 py-3 rounded-lg mx-4 w-4/5"
          value={tableName}
          onChangeText={setTableName}
        />
        <Button className="w-4/6 mt-5" onPress={handleSubmit}>
          Create
        </Button>
      </View>
    </View>
  );
};

export default NewTableScreen;
