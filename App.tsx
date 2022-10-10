import { AuthProvider } from "./src/context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/pages/home";
import LoginScreen from "./src/pages/login";
import { LogBox } from "react-native";
import RegisterScreen from "./src/pages/register";
import { MenuProvider } from "react-native-popup-menu";
import NewBoardScreen from "./src/pages/newBoard";
import NewTaskScreen from "./src/pages/newTask";
import TaskScreen from "./src/pages/task";
import UpdateTableScreen from "./src/pages/updateTable";
import UpdateBoardScreen from "./src/pages/updateBoard";
import UpdateTaskScreen from "./src/pages/updateTask";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NewBoard: {
    tableId: string;
  };
  NewTask: {
    boardId: string;
  };
  Task: {
    taskId: string;
  };
  UpdateTable: {
    tableId: string;
  };
  UpdateBoard: {
    boardId: string;
  };
  UpdateTask: {
    taskId: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// remove warning about an expo bug https://expo.canny.io/feature-requests/p/continued-support-for-asyncstorage
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core"]);

export default function App() {
  const options = { headerShown: false };
  return (
    <MenuProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={options}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={options}
              name="Register"
              component={RegisterScreen}
            />
            <Stack.Screen
              options={options}
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              options={options}
              name="NewBoard"
              component={NewBoardScreen}
            />
            <Stack.Screen
              options={options}
              name="UpdateBoard"
              component={UpdateBoardScreen}
            />
            <Stack.Screen
              options={options}
              name="NewTask"
              component={NewTaskScreen}
            />
            <Stack.Screen
              options={options}
              name="UpdateTask"
              component={UpdateTaskScreen}
            />
            <Stack.Screen
              options={options}
              name="Task"
              component={TaskScreen}
            />
            <Stack.Screen
              options={options}
              name="UpdateTable"
              component={UpdateTableScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </MenuProvider>
  );
}
