import { StyleSheet, Platform, StatusBar } from 'react-native';

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
    marginRight: 10,
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
    minHeight: 120,  // altura mínima, se adapta al contenido
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  companyText: {
    fontWeight: 'bold',
    color: '#2cb67d',
    textAlign: 'center',
  },

  companyName: {
    fontSize: 30, // más grande para resaltar
    fontWeight: 'bold',
    color: '#2cb67d',
    marginBottom: 6,
    textAlign: 'center',
  },

  companyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },

  companyDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
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
