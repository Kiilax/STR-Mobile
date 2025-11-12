import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import BottomTab from "./bottomTab";
import HomeScreen from "../screens/home";
import CreateProjectScreen from "../screens/createProject";
import MapScreen from "../screens/map";
import { RootStackParamList } from "../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="MainApp"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{ title: 'Créer un projet' }} />
      <Stack.Screen name="ProjectMap" component={MapScreen} options={{ title: 'Carte du projet' }} />
    </Stack.Navigator>
  );
}
