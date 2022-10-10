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
  writeBatch,
} from "firebase/firestore";
import { handlePromise } from "../utils";
import { db } from "./firebase";

export const createBoard = async (boardName: string, tableId: string) => {
  const [board, error] = await handlePromise(
    addDoc(collection(db, "board"), {
      name: boardName,
      tableId,
    })
  );
  if (error) {
    throw new Error(error.message);
  }
  console.log("Board added with id:", board.id);
};

export const getBoards = async (tableId: string) => {
  const [boards, error] = await handlePromise(
    getDocs(query(collection(db, "board"), where("tableId", "==", tableId)))
  );
  if (error) {
    throw new Error(error.message);
  }
  return boards.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

export const deleteBoard = async (boardId: string, noLog = false) => {
  const batch = writeBatch(db);

  const [tasks, error] = await handlePromise(
    getDocs(query(collection(db, "task"), where("boardId", "==", boardId)))
  );

  if (error) {
    throw new Error(error.message);
  }

  tasks.forEach((task: any) => {
    batch.delete(task.ref);
  });

  await batch.commit();

  const [_, errorBoard] = await handlePromise(
    deleteDoc(doc(db, "board", boardId))
  );

  if (errorBoard) {
    throw new Error(errorBoard.message);
  }

  if (!noLog) {
    console.log("Board deleted with id:", boardId);
  }
};

export const getBoard = async (boardId: string) => {
  const [board, error] = await handlePromise(getDoc(doc(db, "board", boardId)));

  if (error) {
    throw new Error(error.message);
  }

  return { id: board.id, ...board.data() };
};

export const updateBoard = async (boardId: string, data: { name: string }) => {
  const [_, error] = await handlePromise(
    updateDoc(doc(db, "board", boardId), data)
  );

  if (error) {
    throw new Error(error.message);
  }

  console.log("Updated board with id:", boardId);
};
