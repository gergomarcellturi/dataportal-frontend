import {ResponseStatus} from "./ResponseStatus";

export class Response<T> {
  public data?: T;
  public status!: ResponseStatus;
  public httpCode!: number;
  public messages?: string;
  public errors?: string;
}
