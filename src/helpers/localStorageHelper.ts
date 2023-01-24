export class LocalStorageHelper {
  static getItem(key: string) {
    return localStorage.getItem(key) ?? undefined;
  }

  static getItemAsJSONObject(key: string) {
    const targetItem = localStorage.getItem(key);
    if (targetItem === null) return undefined;

    return JSON.parse(targetItem);
  }

  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static setItemAsObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItemByKey(key: string) {
    localStorage.removeItem(key);
  }
}
