import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {AuthApiService} from "./services/api/auth-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'dataportal-frontend';

  constructor(
    private auth: AuthService,
    private authApi: AuthApiService,
  ) {
  }

  ngOnDestroy() {
    // this.authApi.logout();
  }
}
