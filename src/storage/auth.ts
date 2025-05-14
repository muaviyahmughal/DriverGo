import AsyncStorage from '@react-native-async-storage/async-storage';

const CIVIL_ID_KEY = '@auth_civil_id';

export const saveDriverCivilId = async (civilId: string) => {
  try {
    await AsyncStorage.setItem(CIVIL_ID_KEY, civilId);
    return true;
  } catch (error) {
    console.error('Error saving civil ID:', error);
    return false;
  }
};

export const getSavedCivilId = async () => {
  try {
    return await AsyncStorage.getItem(CIVIL_ID_KEY);
  } catch (error) {
    console.error('Error getting saved civil ID:', error);
    return null;
  }
};

export const clearSavedCivilId = async () => {
  try {
    await AsyncStorage.removeItem(CIVIL_ID_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saved civil ID:', error);
    return false;
  }
};
