import { Text, View } from "react-native";

export default function PointsListScreen() {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 8,
      }}
    >
      <Text>Il faudra mettre ici la liste des points d'intérêt</Text>
    </View>
  );
}
