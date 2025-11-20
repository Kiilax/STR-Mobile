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
    backgroundColor: colors.dark.secondary,
    padding: 15,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
    shadowColor: colors.dark.inverted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 16,
  },
});