import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import { getTable, updateTable } from "../api/table";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import TableLoading from "../components/Table/TableLoading";
import { handlePromise } from "../utils";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateTable">;

const UpdateTableScreen = ({ route }: Props) => {
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const { tableId } = route.params;

  useEffect(() => {
    (async () => {
      const table = await getTable(tableId);
      setTableName(table.name);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (tableName === "") return setError("Table name must not be empty");

    const [_, error] = await handlePromise(
      updateTable(tableId, { name: tableName })
    );

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
            Update Table
          </Text>
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 text-left self-start ml-10">
              {error}
            </Text>
          )}
          <Text className="mb-2 self-start px-14">Name :</Text>
          <TextInput
            placeholder="Table name"
            className="bg-white px-4 py-3 rounded-lg mx-4 w-4/5"
            value={tableName}
            onChangeText={setTableName}
          />
          <Button className="w-4/6 mt-5" onPress={handleSubmit}>
            Update
          </Button>
        </View>
      )}
    </View>
  );
};

export default UpdateTableScreen;
