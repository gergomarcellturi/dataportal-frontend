import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {AuthService} from "./auth.service";
import {AngularFirestore, DocumentData} from "@angular/fire/compat/firestore";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public $requests?: Observable<{metadataUid: string, timestamp: Timestamp, userName: string, userUid: string}[]>
  public requestNum = 0;
  constructor(
    private auth: AuthService,
    private store: AngularFirestore,
  ) {
    this.auth.$portalUser.subscribe(user => {
      if (!user) return;
      this.$requests = this.store.collection('users').doc(user.uid)
        .collection<{metadataUid: string, timestamp: Timestamp, userName: string, userUid: string}>
        ('requests', ref => ref.where('done', '!=', true ))
        .valueChanges();
      this.$requests?.subscribe(requests => {
        this.requestNum = requests.length;
      })
    })
  }

  public getRequestId = (request :{
    metadataUid: string,
    timestamp: Timestamp,
    userName: string,
    userUid: string}, user: User): Observable<firebase.firestore.QuerySnapshot<DocumentData>> => {
    const {metadataUid, userUid} = request;
    return this.store.collection('users').doc(user.uid).collection('requests', ref =>
      ref.where('metadataUid', '==', metadataUid).where('userUid', '==', userUid)
    ).get()
  }

  public accept = (req: {
    metadataUid: string,
    timestamp: Timestamp,
    userName: string,
    userUid: string}, user: User): void => {
    const data: {canAccess: boolean, accesses?: []} = {canAccess: true}
    this.store
      .collection('metadata_preview').doc(req.metadataUid)
      .collection('access').doc(req.userUid).get().subscribe(snap => {
      let prom;
      if (snap.exists) {
        prom = snap.ref.update(data);
      } else {
        data.accesses = [];
        prom = snap.ref.set(data);
      }
      prom.then(() => {
        this.getRequestId(req, user).subscribe(result => {
          const id = result.docs[0].id;
          this.store.collection('users').doc(user.uid).collection('requests').doc(id).delete().then();
        });
      })
    })
  }
  public decline = (req: {metadataUid: string, timestamp: Timestamp, userName: string, userUid: string}, user: User): void => {
    const data: {canAccess: boolean, accesses?: []} = {canAccess: false}
    const requestData = {done: true};
    this.store
      .collection('metadata_preview').doc(req.metadataUid)
      .collection('access').doc(req.userUid).get().subscribe(snap => {
      let prom;
      if (snap.exists) {
        prom = snap.ref.update(data);
      } else {
        data.accesses = [];
        prom = snap.ref.set(data);
      }
      prom.then(() => {
        this.getRequestId(req, user).subscribe(result => {
          const id = result.docs[0].id;
          this.store.collection('users').doc(user.uid).collection('requests').doc(id).update(requestData).then();
        });
      })
    })
  }
}
