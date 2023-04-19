import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {DataSourceStatus} from "../enum/DataSourceStatus";
import {Tag} from "../storage/Tag";
import {FileType} from "../enum/FileType";
import {BaseModel} from "../BaseModel";

export type MetadataPreview = BaseModel & {
  createdAt: Timestamp;
  filename: string;
  lastModified: Timestamp;
  size: number;
  status: DataSourceStatus;
  summary: string;
  tags: Tag[];
  title: string;
  type: FileType;
  userUid: string;
}
