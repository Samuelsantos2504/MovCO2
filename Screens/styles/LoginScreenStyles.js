import { StyleSheet, Platform } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
  },

  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    marginTop: 200,
    elevation: 20,
  },

  titleA: {
    paddingBottom: 15,
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
    color: "rgb(114,239,165)",
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  tabRowLabInp: {
    flexDirection: "row",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2cb67d",
    paddingBottom: 4,
  },

  titleContent:{
    alignItems: "center",
    justifyContent: "center",
  },

  activeText: {
    fontWeight: "bold",
    color: "#000",
  },

  inactiveText: {
    color: "#aaa",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  inputA: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    width: "48%",
    marginRight: "2%",
  },

  TextLabelP: {
    marginRight: 97,
    marginLeft: 5,
    color: "gray",
    paddingBottom: 10,
  },

  TextLabel: {
    marginRight: 97,
    marginLeft: 5,
    color: "gray",
    paddingBottom: 10,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  forgot: {
    color: "#3b82f6",
    textDecorationLine: "underline",
  },

  loginButton: {
    backgroundColor: "#2cb67d",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 20,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  socialText: {
    marginLeft: 10,
    fontSize: 14,
  },

  cardRegister: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    marginTop: 100,
    elevation: 20,
  },
  title: {
    color: "rgb(114,239,165)",
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  }
});
