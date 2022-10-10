import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { handlePromise } from "../utils";
import { deleteBoard } from "./board";
import { db } from "./firebase";

export const createTable = async (tableName: string, userId: string) => {
  const [table, error] = await handlePromise(
    addDoc(collection(db, "table"), {
      name: tableName,
      userId,
    })
  );
  if (error) {
    throw new Error(error.message);
  }
  console.log("Table added with id:", table.id);
};

export const getTables = async (userId: string) => {
  const [tables, error] = await handlePromise(
    getDocs(query(collection(db, "table"), where("userId", "==", userId)))
  );
  if (error) {
    throw new Error(error.message);
  }

  return tables.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

export const getTable = async (tableId: string) => {
  const [table, error] = await handlePromise(getDoc(doc(db, "table", tableId)));

  if (error) {
    throw new Error(error.message);
  }

  return { id: table.id, ...table.data() };
};

export const deleteTable = async (tableId: string) => {
  const [boards, error] = await handlePromise(
    getDocs(query(collection(db, "board"), where("tableId", "==", tableId)))
  );

  if (error) {
    throw new Error(error.message);
  }

  boards.forEach(async (board: any) => {
    await deleteBoard(board.id, true);
  });

  const [_, errorTable] = await handlePromise(
    deleteDoc(doc(db, "table", tableId))
  );

  if (errorTable) {
    throw new Error(errorTable.message);
  }

  console.log("Table deleted with id:", tableId);
};

export const updateTable = async (tableId: string, data: { name: string }) => {
  const [_, error] = await handlePromise(
    updateDoc(doc(db, "table", tableId), data)
  );

  if (error) {
    throw new Error(error.message);
  }

  console.log("Updated table with id:", tableId);
};
