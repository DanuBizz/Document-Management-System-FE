import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// PersistenceService handles storing and retrieving data from local storage.
export class PersistenceService {
  /**
   * Stores data in local storage.
   * @param key The key under which the data will be stored
   * @param data The data to be stored
   */
  set(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to local storage', e);
    }
  }

  /**
   * Retrieves data from local storage.
   * @param key The key under which the data was stored
   * @returns The retrieved data, or null if not found or an error occurred
   */
  get(key: string): unknown {
    try {
      const localStorageItem = localStorage.getItem(key);
      return localStorageItem ? JSON.parse(localStorageItem) : null;
    } catch (e) {
      console.error('Error getting from local storage', e);
      return null;
    }
  }

  /**
   * Removes data from local storage.
   * @param key The key under which the data is stored
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from local storage', e);
    }
  }
}
