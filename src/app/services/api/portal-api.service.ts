import { Injectable } from '@angular/core';
import {BaseApiService, HTTP} from "./base/base-api.service";
import {Metadata} from "../../model/storage/Metadata";
import {Observable} from "rxjs";
import {FileInitRequest} from "../../model/request/FileInitRequest";

@Injectable({
  providedIn: 'root'
})
export class PortalApiService extends BaseApiService<Metadata>{

  constructor(
  ) {
    super("portal")
  }

  public initupload = (body: FileInitRequest): Observable<Metadata | undefined> => {
    return this.call(HTTP.POST, `initupload`, {body});
  }

}
