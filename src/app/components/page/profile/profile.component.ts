import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {GlobalService} from "../../../services/global.service";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {User} from "../../../model/User";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {UserInfo} from "../../../model/UserInfo";
import {PortalApiService} from "../../../services/api/portal-api.service";
import {MetadataPreview} from "../../../model/common/MetadataPreview";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {RequestService} from "../../../services/request.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave]
})
export class ProfileComponent implements OnInit {

  public $user?: Observable<User>;
  public $userInfo?: Observable<UserInfo>;
  public isLoading = false;
  public $metadataPreviews?: Observable<MetadataPreview[]>;

  constructor(
    private route: ActivatedRoute,
    public portalApi: PortalApiService,
    public store: AngularFirestore,
    private authApi: AuthApiService,
    public global: GlobalService,
    public requestService: RequestService,
  ) {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const {uid} = params;
      if (uid) this.setProfileView(uid);
      else this.setOwnProfileView();
      this.$user!.subscribe(user => {
        if (!user) this.global.goTo('');
      })
      this.isLoading = false;
    });
    this.$user?.subscribe(user => {
      if (user) {
        this.$userInfo = this.portalApi.getUserInfoByUserUid(user.uid);
        this.$metadataPreviews = store.collection<MetadataPreview>('metadata_preview',
          ref =>
            ref.where('userUid', '==', user.uid)).valueChanges();

      }
    })
  }

  ngOnInit(): void {
  }

  public setProfileView = (uid: string): void => {
    this.$user = this.authApi.getUserByUid(uid);
  }

  public setOwnProfileView = (): void => {
    this.$user = this.authApi.getCurrentUser();

  }

}
