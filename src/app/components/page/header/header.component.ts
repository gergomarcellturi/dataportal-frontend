import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {GlobalService} from "../../../services/global.service";

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
    public  auth: AngularFireAuth,
    public global: GlobalService,
    private router: Router,
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
    this.auth.signOut()
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.log(error));
  }

}
