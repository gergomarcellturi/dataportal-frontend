import {BaseModel} from "../BaseModel";
import {FileType} from "../enum/FileType";
import {DataSourceStatus} from "../enum/DataSourceStatus";

export type Metadata = BaseModel & {
  userUid: string;
  filename: string;
  size: number;
  type: FileType;
  status: DataSourceStatus;
  datePublished: Date;
  dateDeleted: Date;
}
