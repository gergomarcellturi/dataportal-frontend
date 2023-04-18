import {Component, OnDestroy} from '@angular/core';
import {GlobalService} from "./services/global.service";
import {fadeOutOnLeave} from "./consts/animations";
import {AnimationService} from "./services/animation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeOutOnLeave]
})
export class AppComponent implements OnDestroy{
  title = 'dataportal-frontend';

  constructor(
    public global: GlobalService,
    public animationService: AnimationService
  ) {
  }

  ngOnDestroy() {
    // this.authApi.logout();
  }
}
