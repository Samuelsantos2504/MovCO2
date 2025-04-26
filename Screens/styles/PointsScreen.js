import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  pointsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },

  loginButton: {
    height: 50,
    backgroundColor: "#2cb67d",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },

  titleA:{
    fontSize: 30,
    fontWeight: "bold",
    color: "#2cb67d",
    marginBottom: 20,
    textAlign: "center",
  },

  inputA: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    marginLeft: "5%",
    width: "80%",
    marginRight: "2%",
  },

});
