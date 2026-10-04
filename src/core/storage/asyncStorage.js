import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin wrapper around AsyncStorage that handles JSON (de)serialization and
 * centralizes error handling. This is the ONLY module in the app allowed to
 * import AsyncStorage directly — repositories in each feature's data/ layer
 * go through this, and presentation code must never touch it directly.
 */

/**
 * @param {string} key
 * @returns {Promise<any|null>} parsed value, or null if missing/invalid
 */
export async function getItem(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] failed to read "${key}":`, error);
    return null;
  }
}

/**
 * @param {string} key
 * @param {any} value
 * @returns {Promise<boolean>} true if the write succeeded
 */
export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] failed to write "${key}":`, error);
    return false;
  }
}

/**
 * @param {string} key
 * @returns {Promise<boolean>} true if the removal succeeded
 */
export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[storage] failed to remove "${key}":`, error);
    return false;
  }
}
