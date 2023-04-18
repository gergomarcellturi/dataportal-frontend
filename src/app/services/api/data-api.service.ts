import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Response} from "../../model/common/Response";

@Injectable({
  providedIn: 'root'
})
export class DataApiService{

  constructor(private http: HttpClient) {
  }

  public uploadFile = (params: {metadataId: string}, formData: FormData): Observable<Response<{monitorId: string}>> => {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<Response<{monitorId: string}>>
    (
      `${environment.storageRoot}/data/initupload`,
      formData,
      {params, headers}
    )
  }

}
