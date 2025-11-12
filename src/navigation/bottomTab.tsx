import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import MapScreen from "../screens/map";
import PointsListScreen from "../screens/pointsList";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Points d'intérêt"
        component={PointsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-marker" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
