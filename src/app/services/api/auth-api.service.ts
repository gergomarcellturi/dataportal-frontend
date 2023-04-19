import {Injectable} from '@angular/core';
import {BaseApiService, HTTP} from "./base/base-api.service";
import {Observable} from "rxjs";
import {User} from "../../model/User";

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

  public getUserByUid = (userUid: string): Observable<User> => {
    return this.call(HTTP.GET, `user/${userUid}`) as unknown as Observable<User>
  }

  public getCurrentUser = (): Observable<User> => {
    return this.call(HTTP.GET, `current`) as unknown as Observable<User>;
  }
}
