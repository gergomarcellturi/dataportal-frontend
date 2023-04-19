import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Response} from "../../model/common/Response";
import {Metadata} from "../../model/storage/Metadata";
import {DatasourceDetails} from "../../model/storage/DatasourceDetails";
import { saveAs } from 'file-saver';

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
  public finalizeData = (params: { metadataId: string }, body: DatasourceDetails): Observable<Response<Metadata>> => {
    return this.http.post<Response<Metadata>>
    (
      `${environment.storageRoot}/data/finalize`,
      body,
      {params}
    )
  }

  public getMetadataById = (metadataId: string): Observable<Response<Metadata>> => {
    return this.http.get<Response<Metadata>>(`${environment.storageRoot}/data/${metadataId}`)
  }

  public getDatasourceDetailsByMetadataId = (metadataUid: string): Observable<Response<DatasourceDetails>> => {
    return this.http.get<Response<DatasourceDetails>>(`${environment.storageRoot}/data/details/${metadataUid}`)
  }

  public updateDatasource = (body: {metadata?: Metadata, datasourceDetails?: DatasourceDetails}): Observable<Response<{ metadata: Metadata, datasourceDetails: DatasourceDetails }>> => {
    return this.http.put<Response<{ metadata: Metadata, datasourceDetails: DatasourceDetails }>>
    (`${environment.storageRoot}/data/update`, body)
  }

  public deleteData = (metadataUid: string): Observable<Response<Metadata>> => {
    return this.http.delete<Response<Metadata>>
    (`${environment.storageRoot}/data/${metadataUid}`)
  }

  public downloadFile = (metadataUid: string): void => {
    const url = `${environment.storageRoot}/data/download/${metadataUid}`;
    this.http.get(url, {responseType: 'blob', observe: 'response'}).subscribe((response: HttpResponse<Blob>) => {
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log(response)
      console.log(contentDisposition);
      const filename = this.extractFilenameFromContentDisposition(contentDisposition);
      saveAs(response.body!, filename);
    }, error => {
      console.error('Error downloading file: ', error);
    })
  }

  private extractFilenameFromContentDisposition(contentDisposition: string | null): string {
    if (!contentDisposition) {
      return 'unknown-filename';
    }
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    return (filenameMatch && filenameMatch[1]) ? filenameMatch[1].replace(/['"]/g, '') : 'unknown-filename';
  }

}
