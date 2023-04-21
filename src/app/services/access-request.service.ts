import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AccessRequestService {

  public requests: {
    userName: string,
    userUid: string,
    metadataUid: string,
    timestamp: Timestamp,
  }[] = [];

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
  ) {
    this.auth.$portalUser.subscribe(user => {
      store.collection('users').doc(user?.uid).collection<{
        userName: string,
        userUid: string,
        metadataUid: string,
        timestamp: Timestamp,
      }>('requests').valueChanges().subscribe(requests => {
        this.requests = requests;
      })
    })

  }
}
