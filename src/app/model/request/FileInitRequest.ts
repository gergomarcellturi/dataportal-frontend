import {FileType} from "../enum/FileType";

export type FileInitRequest = {
  filename: string;
  fileType: FileType;
  fileSize: number;
}
