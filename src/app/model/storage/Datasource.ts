import {BaseModel} from "../BaseModel";
import {Metadata} from "./Metadata";

export type Datasource = BaseModel & {
  metadata: Metadata;
  data: Uint8Array[];
}
