import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from "rxjs";
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
  public portalUser?: User
  // @ts-ignore
  public $portalUser: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  constructor(
    private authApi: AuthApiService,
    private afAuth: AngularFireAuth,
  ) {
    this.$portalUser.subscribe(user => {
      this.portalUser = user;
    })
    this.afAuth.authState.pipe(
      map(value => {
        if (value?.uid) {
          this.authApi.login().subscribe();
          const sub = this.authApi.getCurrentUser().subscribe(user => {
            this.$portalUser.next(user);
            sub.unsubscribe();
          })
        } else {
          if (this.firebaseUser) {
            this.authApi.logout(this.firebaseUser.uid).subscribe();
            this.portalUser = undefined;
          }
        }
        this.firebaseUser = value;
      }),
    ).subscribe()
  }
}
