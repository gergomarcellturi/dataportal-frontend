import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'DPProfile',
  templateUrl: './dp-profile.component.html',
  styleUrls: ['./dp-profile.component.css']
})
export class DpProfileComponent implements OnInit {

  @Input() user?: User;

  constructor(private auth: AuthService) {
    if (this.user)
      this.user = this.auth.portalUser;
  }

  ngOnInit(): void {
  }

}
