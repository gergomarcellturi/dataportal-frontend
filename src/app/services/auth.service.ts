import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../model/User";
import {map} from "rxjs/operators";
import {AuthApiService} from "./api/auth-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user: Observable<User> = new Observable<User>();

  constructor(
    private authApi: AuthApiService,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.pipe(
      map(value => {
        if (value?.uid) {
          this.authApi.login().subscribe();
        } else {
          this.authApi.logout().subscribe();
        }
      })
    ).subscribe()
  }
}
