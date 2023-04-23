import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";
import {firstValueFrom, Observable, Subscription} from "rxjs";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {PortalApiService} from "../../../services/api/portal-api.service";
import {UserInfo} from "../../../model/UserInfo";
import {UserInfoContact} from "../../../model/UserInfoContact";
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "../../dialogs/profile-dialog/profile-dialog.component";

@Component({
  selector: 'DPProfile',
  templateUrl: './dp-profile.component.html',
  styleUrls: ['./dp-profile.component.css']
})
export class DpProfileComponent implements OnInit {

  public userInfo?: UserInfo;
  public userInfoContact?: UserInfoContact;
  @Input() user?: User;
  @Input() userUid?: string;
  @Input() allowEdit = false;
  @Input() linked = true;
  @Input() showLoginStatus = true;
  $login?: Observable<{lastOnline: Timestamp, loggedInStatus: 'ONLINE' | 'OFFLINE'}>
  subs: Subscription[] = [];
  set sub(s: Subscription) {
    this.subs.push(s);
  }
  constructor(
    public auth: AuthService,
    public portalApi: PortalApiService,
    private dialog: MatDialog,
    private authApi: AuthApiService,
    private store: AngularFirestore
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.userUid && !this.user) {
      this.authApi.getUserByUid(this.userUid).subscribe(user => {
        this.user = user;
        this.ngOnInit().then();
      })
      return;
    }


    if (!this.user)
      this.user = await firstValueFrom(this.authApi.getCurrentUser());

    if (this.user?.uid) {
      this.sub = this.portalApi.getUserInfoByUserUid(this.user.uid).subscribe(userInfo => {
        this.userInfo = userInfo;
      });
      this.sub = this.portalApi.getUserContactsByUserUid(this.user.uid).subscribe(contacts => {
        this.userInfoContact = contacts;
      })
      this.$login = this.store.collection('users')
        .doc(this.user.uid).valueChanges() as
        Observable<{ lastOnline: Timestamp, loggedInStatus: 'ONLINE' | 'OFFLINE' }>;
    }
  }

  public clearSubs = (): void => {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

  public editProfile = (data: string): void => {
    this.dialog.open(ProfileDialogComponent, {data}).afterClosed().subscribe(response => {
      if (response) location.reload();
    })
  }
}
