import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { INTEREST_POINTS_MOCK } from "../interest-points/data/interest-points.mock";

// for the moment, we use a placeholder image for all interest points
const placeholderImg = require("./data/placeholder.jpg");

export default function InterestPointListScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {INTEREST_POINTS_MOCK.map((eq) => (
        <View key={eq.id} style={styles.item}>
          <Image source={placeholderImg} style={styles.icon} />
          <Text style={styles.text}>{eq.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: "#F5F9FC",

  },
  item: { 
    flexDirection: "row",
    alignItems: "center",
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#0055A4",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#0055A4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#0055A4"
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12
  },
  text: {
    flex: 1,
    color: "#333333",
    fontSize: 16,
    lineHeight: 22
  },
});