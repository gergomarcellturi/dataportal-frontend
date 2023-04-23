import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PortalApiService} from "../../../services/api/portal-api.service";
import {GlobalService} from "../../../services/global.service";
import {User} from "../../../model/User";
import {UserInfo} from "../../../model/UserInfo";
import {UserInfoContact} from "../../../model/UserInfoContact";
import {AuthApiService} from "../../../services/api/auth-api.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {ckeditorConfig} from "../../../consts/misc";
import {zip} from "rxjs";


@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit {

  public editor = ClassicEditor;
  public user?: User;
  public userInfo?: UserInfo;
  public userInfoContact?: UserInfoContact;
  public ckeditorConfig = ckeditorConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userUid: string,
    public portalApi: PortalApiService,
    public authApi: AuthApiService,
    public global: GlobalService,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
  ) {
    portalApi.getUserContactsByUserUid(userUid).subscribe(contacts => this.userInfoContact = contacts);
    portalApi.getUserInfoByUserUid(userUid).subscribe(info => this.userInfo = info);
    authApi.getUserByUid(userUid).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  public save = (): void => {
    const nickname = this.user?.username;
    if (!nickname) return;
    let callArr: any = [];
    if (this.userInfoContact)
      callArr = [...callArr, this.portalApi.updateUserInfoContacts(this.userInfoContact!)];
    if (this.userInfo)
      callArr = [...callArr, this.portalApi.updateUserInfo(this.userInfo!)];
    zip(
      this.authApi.updateUserNickname(this.user!.uid, {nickname}),
      ...callArr,
    ).subscribe(result => {
      this.dialogRef.close(result[0])
    })
  }

}
