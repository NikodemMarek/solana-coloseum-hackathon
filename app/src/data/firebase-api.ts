import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { IdeaContent } from "./data.ts";

async function createIdeasContent(content: IdeaContent): Promise<string> {
  const db = getFirestore();

  const res = await addDoc(collection(db, "ideas"), content);

  return res.id;
}

async function getIdeasContent(uri: string): Promise<IdeaContent> {
  const db = getFirestore();

  const docRef = doc(db, "ideas", uri);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("idea content not found");
  }
}

export { createIdeasContent, getIdeasContent };
