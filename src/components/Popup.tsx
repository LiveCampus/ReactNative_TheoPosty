import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface Props {
  updateCallback: () => void;
  deleteCallback: () => void;
}

const Popup = ({ updateCallback, deleteCallback }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <View className="py-1">
      <Menu opened={opened} onBackdropPress={() => setOpened(false)}>
        <MenuTrigger onPress={() => setOpened(true)}>
          <Ionicons name="ellipsis-vertical-sharp" size={17} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            customStyles={{
              optionWrapper: {
                padding: 0,
              },
            }}
          >
            <MenuOption
              customStyles={{
                optionWrapper: {
                  padding: 0,
                },
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setOpened(false);
                  updateCallback();
                }}
                className="flex flex-row items-center space-x-1 bg-amber-600 px-3 py-2"
              >
                <Ionicons name="ios-pencil" color="white" />
                <Text className="text-white">Update</Text>
              </TouchableOpacity>
            </MenuOption>
            <TouchableOpacity
              onPress={() => {
                setOpened(false);
                deleteCallback();
              }}
              className="flex flex-row items-center space-x-1 bg-red-400 px-3 py-2"
            >
              <Ionicons name="trash-outline" color="white" />
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default Popup;
