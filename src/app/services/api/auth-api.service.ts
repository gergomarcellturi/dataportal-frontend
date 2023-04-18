import {Injectable} from '@angular/core';
import {BaseApiService, HTTP} from "./base/base-api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends BaseApiService<string> {

  constructor() {
    super("auth")
  }

  public login = (): Observable<string | undefined> => {
    return this.call(HTTP.POST, `login`);
  }
  public logout = (authUid: string): Observable<string | undefined> => {
    return this.call(HTTP.POST, `logout`, {params: {authUid}});
  }

}
