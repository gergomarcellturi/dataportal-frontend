import {BaseModel} from "../BaseModel";
import {FileType} from "../enum/FileType";
import {DataSourceStatus} from "../enum/DataSourceStatus";
import { DataDownloadAccess } from "../enum/DataDownloadAccess";
import {DataAccess} from "../enum/DataAccess";

export type Metadata = BaseModel & {
  userUid: string;
  filename: string;
  size: number;
  type: FileType;
  status: DataSourceStatus;
  datePublished: Date;
  dateDeleted: Date;
  dataDownloadAccess: DataDownloadAccess;
  dataAccess: DataAccess;
}
