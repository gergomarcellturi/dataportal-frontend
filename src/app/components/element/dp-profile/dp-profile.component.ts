import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";
import {firstValueFrom, Observable} from "rxjs";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthApiService} from "../../../services/api/auth-api.service";

@Component({
  selector: 'DPProfile',
  templateUrl: './dp-profile.component.html',
  styleUrls: ['./dp-profile.component.css']
})
export class DpProfileComponent implements OnInit {

  @Input() user?: User;
  @Input() allowEdit = false;
  @Input() showLoginStatus = true;
  $login?: Observable<{lastOnline: Timestamp, loggedInStatus: 'ONLINE' | 'OFFLINE'}>
  constructor(
    private auth: AuthService,
    private authApi: AuthApiService,
    private store: AngularFirestore
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.user)
      this.user = await firstValueFrom(this.authApi.getCurrentUser());


    if (this.user?.uid) {
      this.$login = this.store.collection('users')
        .doc(this.user.uid).valueChanges() as
        Observable<{ lastOnline: Timestamp, loggedInStatus: 'ONLINE' | 'OFFLINE' }>;
      this.$login.subscribe(console.log);
    }
    console.log(this.user);
  }

  public editProfile = (): void => {
    console.log('edit profile')
  }
}
