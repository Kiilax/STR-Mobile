import { colors } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    backgroundColor: colors.dark.secondary,
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: colors.dark.inverted,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
  },
  title: {
    color: colors.dark.inverted,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  comment: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 16,
    lineHeight: 22,
  },
  imagesContainer: {
    marginTop: 16,
    marginLeft: 5
  },
  imageContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '85%',
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: colors.dark.secondary,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    backgroundColor: colors.dark.secondary,
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: colors.dark.inverted,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
  },
  sectionTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  carouselIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  indicatorText: {
    color: colors.dark.inverted,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});