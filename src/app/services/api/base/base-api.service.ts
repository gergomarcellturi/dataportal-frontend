import {Inject, inject, Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable, of, switchMap} from "rxjs";
import {Response} from "../../../model/common/Response";
import {ResponseStatus} from "../../../model/common/ResponseStatus";


export enum HTTP {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService<T> {

  private http = inject(HttpClient);

  constructor(
    @Inject(String) protected controllerUrl: string,
  ) { }

  protected callStorage = (method: HTTP, apiEntry: string, options?: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    responseType?: 'json';
    reportProgress?: boolean;
    withCredentials?: boolean;
  }): Observable<T | undefined> => {
    return this.http.request<Response<T>>(method, `${environment.storageRoot}/${this.controllerUrl}/${apiEntry}`, options).pipe(
      switchMap(result => {
        switch (result.status) {
          case ResponseStatus.OK:
            return of(result.data);
          case ResponseStatus.ERROR:
            console.error(result)
            return of(undefined);
        }
      })
    )
  }
  protected call = (method: HTTP, apiEntry: string, options?: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    responseType?: 'json';
    reportProgress?: boolean;
    withCredentials?: boolean;
  }): Observable<T | undefined> => {
    return this.http.request<Response<T>>(method, `${environment.backendRoot}/${this.controllerUrl}/${apiEntry}`, options).pipe(
      switchMap(result => {
        switch (result.status) {
          case ResponseStatus.OK:
            return of(result.data);
          case ResponseStatus.ERROR:
            console.error(result)
            return of(undefined);
        }
      })
    )
  }
}
