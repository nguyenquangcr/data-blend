export const getLocalStorage = key => {
  try {
    return localStorage.getItem(key);
  } catch {
    // if the item doesn't exist, return null
    return null;
  }
};
