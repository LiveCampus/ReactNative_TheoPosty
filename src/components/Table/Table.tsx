import { useNavigation } from "@react-navigation/native";
import { forwardRef, useEffect, useState } from "react";
import { Alert, Text, View, ViewProps } from "react-native";
import { getBoards } from "../../api/board";
import { deleteTable } from "../../api/table";
import Board from "../Board/Board";
import BoardLoading from "../Board/BoardLoading";
import IconButton from "../IconButton";
import Popup from "../Popup";

interface Props extends ViewProps {
  title: string;
  id: string;
  refresh: () => void;
  handleScroll: () => void;
}

const Table = forwardRef<View, Props>(
  ({ title, id, style, refresh, handleScroll, ...props }, ref) => {
    const navigation = useNavigation<any>();

    const [loading, setLoading] = useState(true);
    const [boards, setBoards] = useState<any[]>([]);
    const [refreshValue, setRefreshValue] = useState(0);

    useEffect(() => {
      (async () => {
        const boards = await getBoards(id);

        setBoards(boards);
        setLoading(false);
      })();
    }, [refreshValue]);

    const refreshBoards = () => {
      setRefreshValue(Math.random);
    };

    const handleDelete = () => {
      Alert.alert(
        "You're about to delete a table, all it's boards and all it's tasks",
        title,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              await deleteTable(id);
              refresh();
              handleScroll();
            },
          },
        ]
      );
    };

    const handleUpdate = () => {
      navigation.navigate("UpdateTable", { tableId: id });
    };

    return (
      <View
        ref={ref}
        className="py-1 w-screen px-3 flex items-center"
        {...props}
      >
        <View className="flex flex-row items-start justify-center self-start left-0">
          <Text className="self-start text-xl mb-2 font-black text-gray-900 mr-1">
            {title}
          </Text>
          <IconButton
            name="add-circle-outline"
            size={20}
            iconColor="#1f2937"
            onPress={() => {
              navigation.navigate("NewBoard", {
                tableId: id,
              });
            }}
          />
          <Popup updateCallback={handleUpdate} deleteCallback={handleDelete} />
        </View>
        <View className="w-full space-y-3">
          {loading ? (
            <BoardLoading />
          ) : boards.length === 0 ? (
            <Text className="text-gray-400 font-bold">
              There is no board here ¯\_(ツ)_/¯
            </Text>
          ) : (
            boards.map((board) => (
              <Board
                id={board.id}
                title={board.name}
                key={board.id}
                refresh={refreshBoards}
              />
            ))
          )}
        </View>
      </View>
    );
  }
);

export default Table;
