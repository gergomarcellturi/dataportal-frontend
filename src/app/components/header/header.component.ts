import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthApiService} from "../../services/api/auth-api.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter();
  @Output() openProfileMenu = new EventEmitter();
  @Output() openSettingsMenu = new EventEmitter();
  @Output() logout = new EventEmitter();


  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private authApi: AuthApiService,
  ) {}

  ngOnInit(): void {
  }

  toggleSidenavClick() {
    this.toggleSidenav.emit();
  }

  openProfileMenuClick() {
    this.openProfileMenu.emit();
  }

  openSettingsMenuClick() {
    this.openSettingsMenu.emit();
  }

  logoutClick() {
    this.authApi.logout().subscribe(() => {
      this.auth.signOut()
        .then(() => this.router.navigate(['/login']))
        .catch(error => console.log(error));
    })
  }

}
