import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export type LoadProgress = {
  filename: string;
  userUid: string;
  progress: number;
  lastModified: Timestamp;
  status: 'UPLOADING' | 'INTERRUPTED' | 'FINISHED' | 'SAVING'
}
