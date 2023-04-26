import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../model/User";
import {map} from "rxjs/operators";
import {AuthApiService} from "./api/auth-api.service";
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public firebaseUser?: firebase.User | null;
  public userApiKey?: string;
  public portalUser?: User
  // @ts-ignore
  public $portalUser: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  public $userApiKey: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private authApi: AuthApiService,
    private afAuth: AngularFireAuth,
  ) {
    this.$portalUser.subscribe(user => {
      this.portalUser = user;
    })
    this.$userApiKey.subscribe(key => {
      this.userApiKey = key;
    });
    this.afAuth.authState.pipe(
      map(value => {
        if (value?.uid) {
          const sub1 = this.authApi.getCurrentUser().subscribe(user => {
            if (!this.portalUser || user.uid !== this.portalUser.uid)
              this.$portalUser.next(user);
            this.authApi.login().subscribe();
            sub1.unsubscribe();
          });
        } else {
          if (this.firebaseUser) {
            this.authApi.logout(this.firebaseUser.uid).subscribe();
            this.portalUser = undefined;
            this.userApiKey = undefined;
          }
        }
        this.firebaseUser = value;
      }),
    ).subscribe()
  }
}
