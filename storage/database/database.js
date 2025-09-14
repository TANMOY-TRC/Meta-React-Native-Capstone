import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export const createTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS menuItems (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);"
        );
      },
      reject,
      resolve
    );
  });
};

export const getMenuItems = async () => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM menuItems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

export const saveMenuItems = (menuItems) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO menuItems (name, price, description, image, category) VALUES ${menuItems.map((item) =>
        `("${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
      ).join(", ")
      }`
    )
  });
};

export const filterByQueryAndCategories  = async (query, activeCategories) => {
  return new Promise((resolve, reject) => {
    const placeholders = activeCategories.map(() => "?").join(", ");
    db.transaction(
      tx => {
        tx.executeSql(`SELECT * FROM menuItems WHERE category IN (${placeholders}) AND name LIKE ?`, [...activeCategories, `%${query}%`], (_, { rows }) => {
          resolve(rows._array)
        })
      },
      (error) => {
        reject(error);
      }
    );
  });
};
