import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {zip} from "rxjs";
import {DataApiService} from "../../../services/api/data-api.service";
import {GlobalService} from "../../../services/global.service";
import {Metadata} from "../../../model/storage/Metadata";
import {DatasourceDetails} from "../../../model/storage/DatasourceDetails";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";
import {DataSourceStatus} from "../../../model/enum/DataSourceStatus";
import {DataAccess} from 'src/app/model/enum/DataAccess';
import {DataDownloadAccess} from 'src/app/model/enum/DataDownloadAccess';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {environment} from "../../../../environments/environment";
import firebase from 'firebase/compat/app';
import {FadeOutDirective} from "../../../directives/fade-out.directive";
import {AnimationService} from "../../../services/animation.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave]
})
export class DataViewComponent implements OnInit, AfterViewInit {
  @ViewChildren(FadeOutDirective)
  set fadeOutOnLeaveAnimation(query: QueryList<ElementRef<HTMLDivElement>>) {
    this.animationService.add(query, this);
  }
  public metadata?: Metadata;
  public uploader?: User;
  public datasourceDetails?: DatasourceDetails;
  public isLoading = false;
  public DataAccess = DataAccess;
  public DataDownloadAccess = DataDownloadAccess;
  public DataSourceStatus = DataSourceStatus;
  public content?: string;
  public currUser?: User;
  public canAccess: boolean = false;
  public showApi = false;
  public alreadyRequested = false;
  public apiLink = '';
  public apiSegmentedLink = '';
  constructor(
    private route: ActivatedRoute,
    public dataApiService: DataApiService,
    public authApi: AuthApiService,
    public store: AngularFirestore,
    public auth: AuthService,
    public snackbar: MatSnackBar,
    public animationService: AnimationService,
    public global: GlobalService,
  ) {
    this.route.params.subscribe(params => {
      const {uid} = params;
      if (!uid) {
        this.global.goTo('/');
        return;
      }

      zip(
        this.dataApiService.getMetadataById(uid),
        this.dataApiService.getDatasourceDetailsByMetadataId(uid)
      ).subscribe(result => {
        this.metadata = result[0].data;
        this.datasourceDetails = result[1].data;
        this.auth.$portalUser.subscribe(user => {
          this.currUser = user;
          if (this.currUser) {
            this.checkRequested();
          }
          this.setApiLinks();
          this.checkAccess();
        });
        if (!this.metadata?.uid) return;
        this.authApi.getUserByUid(this.metadata.userUid).subscribe(user => {
          this.uploader = user;
        })
      })
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.animationService.destroy(this);
  }

  public setApiLinks = (): void => {
    this.auth.$userApiKey.subscribe(key => {
      if (this.metadata?.dataAccess === DataAccess.OPEN && !key) {
        this.apiLink = `${environment.storageRoot}/api/file/${this.metadata?.uid}`;
        this.apiSegmentedLink = `${environment.storageRoot}/api/segmented/${this.metadata?.uid}`;

      } else {
        this.apiLink = `${environment.storageRoot}/api/file/${this.metadata?.uid}?apiKey=${key}`;
        this.apiSegmentedLink = `${environment.storageRoot}/api/segmented/${this.metadata?.uid}?apiKey=${key}&segment=0`;
      }
    })
  }

  public copy = (link: string): void => {
    navigator.clipboard.writeText(link);
    this.snackbar.open('Link Copied!', 'Close', {duration: 3000});
  }

  public checkAccess = (): void => {
    this.auth.$portalUser.subscribe(user => {
      if (this.metadata?.dataAccess === DataAccess.OPEN) {
        this.canAccess = true;
        return;
      }

      if (user?.uid === this.metadata?.userUid) {
        this.canAccess = true;
        return;
      }
      this.store.collection('metadata_preview').doc(this.metadata?.uid).collection<{canAccess: true}>('access').doc(this.currUser?.uid)
        .valueChanges().subscribe(access => {
        if (!access) {
          this.canAccess = false;
        } else {
          const {canAccess} = access;
          this.canAccess = canAccess;
        }
      })
    })

  }

  public checkRequested = (): void => {
    this.store.collection('users')
      .doc(this.metadata?.userUid).collection<{
      userName: string; userUid: string; metadatUid: string; timestamp: Timestamp
    }>('requests', ref => ref
        .where('metadataUid', '==', this.metadata?.uid)
        .where('userUid', '==', this.currUser?.uid)).valueChanges().subscribe(snap => {
          if (snap.length) this.alreadyRequested = true;
      });
  }

  public requestAccess = (metadata: Metadata): void => {
    const collectionRef =  this.store.collection('users').doc(metadata.userUid).collection('requests');
    const data  = {
      userName: this.currUser?.username,
      userUid: this.currUser?.uid,
      metadataUid: metadata.uid,
      timestamp: Timestamp.now(),
      done: false,
    }
    collectionRef.add(data).then();
  }

}
