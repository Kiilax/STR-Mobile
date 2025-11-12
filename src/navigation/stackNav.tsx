import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import BottomTab from "./bottomTab";
import { RootStackParamList } from "../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="MainApp"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
