import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./dashboard";
import NewBoardScreen from "./newBoard";
import NewTableScreen from "./newTable";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused
                ? "md-file-tray-stacked"
                : "md-file-tray-stacked-outline";
              break;
            case "NewTable":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;

            default:
              iconName = "ellipsis-horizontal-sharp";
              break;
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="NewTable"
        component={NewTableScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
