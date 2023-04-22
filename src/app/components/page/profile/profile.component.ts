import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, zip} from "rxjs";
import {GlobalService} from "../../../services/global.service";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave]
})
export class ProfileComponent implements OnInit {

  public $user?: Observable<User>;
  public isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private authApi: AuthApiService,
    private auth: AuthService,
    private global: GlobalService,
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
