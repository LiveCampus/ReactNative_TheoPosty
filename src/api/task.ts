import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { handlePromise } from "../utils";
import { db, storage } from "./firebase";
import { uuidv4 } from "@firebase/util";
import { getBoard } from "./board";

export const createTask = async (taskName: string, boardId: string) => {
  const [tasks, errorTasks] = await handlePromise(
    getDocs(query(collection(db, "task"), where("boardId", "==", boardId)))
  );
  if (errorTasks) {
    throw new Error(errorTasks.message);
  }

  const [task, error] = await handlePromise(
    addDoc(collection(db, "task"), {
      name: taskName,
      boardId,
      order: tasks.size,
      images: [],
    })
  );
  if (error) {
    throw new Error(error.message);
  }
  console.log("Task added with id:", task.id);
};

export const getTasks = async (boardId: string) => {
  const [tasks, error] = await handlePromise(
    getDocs(query(collection(db, "task"), where("boardId", "==", boardId)))
  );
  if (error) {
    throw new Error(error.message);
  }
  return tasks.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (taskId: string) => {
  const [_, error] = await handlePromise(deleteDoc(doc(db, "task", taskId)));
  if (error) {
    throw new Error(error.message);
  }
  console.log("Task deleted with id:", taskId);
};

export const getTask = async (taskId: string) => {
  const [task, error] = await handlePromise(getDoc(doc(db, "task", taskId)));

  if (error) {
    throw new Error(error.message);
  }

  return { id: task.id, ...task.data() };
};

export const addImage = async (taskId: string, uri: string) => {
  const blob = await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.error(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(storage, uuidv4());
  const [_upload, uploadError] = await handlePromise(
    uploadBytes(fileRef, blob)
  );

  blob.close();

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const url = await getDownloadURL(fileRef);

  const [_update, error] = await handlePromise(
    updateDoc(doc(db, "task", taskId), {
      images: arrayUnion(url),
    })
  );
  if (error) {
    throw new Error(error);
  }
  console.log("Added new Image:", url);
};

export const deleteImage = async (taskId: string, uri: string) => {
  const [_, error] = await handlePromise(
    updateDoc(doc(db, "task", taskId), {
      images: arrayRemove(uri),
    })
  );

  if (error) {
    throw new Error(error.message);
  }

  const imageRef = ref(storage, uri);
  const [_ref, errorRef] = await handlePromise(deleteObject(imageRef));

  if (errorRef) {
    throw new Error(errorRef.message);
  }

  console.log("Deleted Image:", uri);
};

export const updateTask = async (
  taskId: string,
  data: { name: string; order: number; boardId: string }
) => {
  const { name, boardId } = data;
  const oldTask = await getTask(taskId);

  const [_, error] = await handlePromise(
    updateDoc(doc(db, "task", taskId), { name, boardId })
  );

  if (data.order !== oldTask.order && data.boardId === oldTask.boardId) {
    await updateTaskOrder(taskId, data.order);
  }

  if (error) {
    throw new Error(error.message);
  }

  console.log("Updated task with id:", taskId);
};

export const getTaskTable = async (taskId: string) => {
  const task = await getTask(taskId);
  const board = await getBoard(task.boardId);

  return board.tableId;
};

export const updateTaskOrder = async (taskId: string, order: number) => {
  const oldTask = await getTask(taskId);
  const oldTasks = await getTasks(oldTask.boardId);

  if (oldTask.order === order) return;

  if (oldTask.order > order) {
    const tasksToUpdate = oldTasks
      .filter((task: any) => task.order >= order && task.order < oldTask.order)
      .map((task: any) => task.id);

    tasksToUpdate.forEach(async (taskId: any) => {
      const [_, error] = await handlePromise(
        updateDoc(doc(db, "task", taskId), { order: increment(1) })
      );
      if (error) {
        throw new Error(error.message);
      }
    });
  } else {
    const tasksToUpdate = oldTasks
      .filter((task: any) => task.order <= order && task.order > oldTask.order)
      .map((task: any) => task.id);

    tasksToUpdate.forEach(async (taskId: any) => {
      const [_, error] = await handlePromise(
        updateDoc(doc(db, "task", taskId), { order: increment(-1) })
      );
      if (error) {
        throw new Error(error.message);
      }
    });
  }

  const [_, error] = await handlePromise(
    updateDoc(doc(db, "task", taskId), { order: order })
  );
  if (error) {
    throw new Error(error.message);
  }
};
