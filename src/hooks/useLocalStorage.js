import { useState } from 'react';

/**
 * useLocalStorage – persists state in localStorage as JSON.
 * Works exactly like useState but reads/writes to localStorage.
 *
 * @param {string} key       - localStorage key
 * @param {*}      initial   - default value when key is absent
 */
function useLocalStorage(key, initial) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initial;
    } catch (err) {
      console.warn(`useLocalStorage: could not read key "${key}"`, err);
      return initial;
    }
  });

  function setValue(value) {
    try {
      // Allow functional updates (same API as useState)
      const valueToStore =
        typeof value === 'function' ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.warn(`useLocalStorage: could not write key "${key}"`, err);
    }
  }

  return [storedValue, setValue];
}

export default useLocalStorage;
