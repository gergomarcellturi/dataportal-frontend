import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../model/User";
import {map} from "rxjs/operators";
import {AuthApiService} from "./api/auth-api.service";
import firebase from "firebase/compat/app";
import {user} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user: Observable<User> = new Observable<User>();
  public user?: firebase.User | null;
  constructor(
    private authApi: AuthApiService,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.pipe(
      map(value => {
        if (value?.uid) {
          console.log(value);
          this.authApi.login().subscribe();
        } else {
          if (this.user) {
            this.authApi.logout(this.user.uid).subscribe();
          }
        }
        this.user = value;
      })
    ).subscribe()
  }
}
