import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { auth } from "../api/firebase";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <View className="flex flex-row items-center justify-between pr-2 mb-2 px-2 flex-auto">
      <View>
        <Text className="text-gray-400 leading-5">Livecampus Kanban</Text>
        <Text className="font-bold text-xl leading-6">
          {auth.currentUser?.email}
        </Text>
      </View>
      <View className="flex flex-row mr-3">
        <Menu>
          <MenuTrigger>
            <Ionicons name="md-settings-outline" size={32} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              customStyles={{
                optionWrapper: {
                  padding: 0,
                },
              }}
            >
              <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-3 flex flex-row items-center space-x-1"
              >
                <Ionicons name="log-out" size={15} />
                <Text>Sign Out</Text>
              </TouchableOpacity>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default Header;
