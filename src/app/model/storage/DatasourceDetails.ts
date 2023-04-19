import {BaseModel} from "../BaseModel";
import {Tag} from "./Tag";

export type DatasourceDetails = BaseModel & {
  uid: string;
  title: string;
  summary: string;
  description: string;
  tags: Tag[];
}
