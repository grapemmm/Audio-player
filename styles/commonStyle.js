// styles/commonStyles.js
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2C2C2E',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#444',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  playlistHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default commonStyles;



