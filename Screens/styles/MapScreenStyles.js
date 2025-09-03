import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    padding: 12,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#2cb67d",
  },
  pointsContainer: {
    backgroundColor: "#2cb67d",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginLeft: 6,
    elevation: 2,
  },
  pointsText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
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
    flexDirection: "row",
    gap: 12,
  },

  transportButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    width: "30%",
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

  tripInfoBox: {
    position: "absolute",
    bottom: 120, // 👈 encima de los botones de transporte
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },

  tripInfoText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },

  startTripButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },

  startTripButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
