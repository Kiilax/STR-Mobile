import { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InterestPoint } from "../types";
import { colors } from "../constants/theme";

export default function SearchBar({data, onFilter}: {data?: InterestPoint[], onFilter?: (results: InterestPoint[]) => void}) {
  const [query, setQuery] = useState("");

  const handleSearch = (text: string) => {
    setQuery(text);
    if (onFilter && data) {
      const filtered = data.filter((item) =>
        item.comment.toLowerCase().includes(text.toLowerCase())
      );
      onFilter(filtered);
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} style={styles.icon} />
      <TextInput
        placeholder="Rechercher..."
        value={query}
        onChangeText={(text) => { handleSearch(text); }}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.dark.inverted,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
    opacity: 0.6,
    color: colors.dark.text,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 15,
  },
});