import {Injectable} from '@angular/core';
import {BaseApiService, HTTP} from "./base/base-api.service";
import {Metadata} from "../../model/storage/Metadata";
import {Observable} from "rxjs";
import {FileInitRequest} from "../../model/request/FileInitRequest";
import {UserInfo} from "../../model/UserInfo";
import {UserInfoContact} from "../../model/UserInfoContact";

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

  public updateUserInfo = (body: UserInfo): Observable<UserInfo> => {
    return this.call(HTTP.PUT, 'userInfo', {body}) as unknown as Observable<UserInfo>;
  }

  public updateUserInfoContacts = (body: UserInfoContact): Observable<UserInfoContact> => {
    return this.call(HTTP.PUT, 'userInfoContact', {body}) as unknown as Observable<UserInfoContact>;
  }

  public getUserInfoByUserUid = (userUid: string) => {
    return this.call(HTTP.GET, `userInfo/user/${userUid}`) as unknown as Observable<UserInfo>;
  }

  public getUserInfoIntroductionByUserUid = (userUid: string) => {
    return this.call(HTTP.GET, `userInfo/info/${userUid}`) as unknown as Observable<string>;
  }

  public getUserContactsByUserUid = (userUid: string) => {
    return this.call(HTTP.GET, `contact/user/${userUid}`) as unknown as Observable<UserInfoContact>;
  }

}
