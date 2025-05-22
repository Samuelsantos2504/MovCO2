import { StyleSheet, Platform, StatusBar  } from 'react-native';

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  backButton: {
    marginRight: 10,
  },

  titleA: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2cb67d',
    flex: 1,
    textAlign: 'center',
    marginRight: 10, // Para centrar el texto entre botón y borde
  },

  pointsContainer: {
    marginTop: 10,
    backgroundColor: "#2cb67d",
    borderRadius: 20,
  },
  pointsText: {
    borderRadius: 10,
    backgroundColor: "#2cb67d",
    marginTop: 20,
    color: "#FFF",
    fontWeight: "600",
    padding: 8,
    fontSize: 16,
    height: 40,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  searchIcon: {
    marginRight: 8,
  },

  inputA: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  companyButton: {
    width: '45%',
    height: 120,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  companyIcon: {
    marginBottom: 8,
  },

  companyText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2cb67d',
  },

  pointsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  loginButton: {
    height: 50,
    backgroundColor: '#2cb67d',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
