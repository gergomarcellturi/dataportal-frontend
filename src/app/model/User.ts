import {UserStatus} from "./enum/UserStatus";
import {AuthProvider} from "./enum/AuthProvider";
import {BaseModel} from "./BaseModel";

export type User = BaseModel & {
  authUid: string;
  email: string;
  username: string;
  status: UserStatus;
  authProvider: AuthProvider;

}
