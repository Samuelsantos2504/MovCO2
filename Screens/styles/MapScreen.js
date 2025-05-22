import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2cb67d",
  },
  pointsContainer: {
    backgroundColor: "#2cb67d",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 2,
  },
  pointsText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  searchContainer: {
    gap: 8,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    gap: 8,
  },
  inputText: {
    color: "#333",
    fontSize: 16,
    flex: 1,
  },
  searchModal: {
    position: "absolute",
    top: 140,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    zIndex: 2,
    elevation: 4,
    maxHeight: 200,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  locationName: {
    fontSize: 16,
    color: "#333",
  },
  map: {
    flex: 1,
  },
  transportContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    flexDirection: "column", // <- antes era 'row'
    gap: 12,
  },

  transportButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    width: "33%",
    alignItems: "center",
  },
  selectedTransport: {
    backgroundColor: "#2cb67d",
  },
  transportText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#2cb67d",
  },
  selectedTransportText: {
    color: "#FFF",
  },
  pulseEffect: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF5020",
    borderWidth: 2,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  markerPin: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
    elevation: 4,
  },
  markerText: {
    fontSize: 10,
    color: "#333",
    marginTop: 4,
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  distanceText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },

  startButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  startButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});