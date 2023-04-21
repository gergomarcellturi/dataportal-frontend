import {ChangeDetectorRef, Injectable} from '@angular/core';
import {routes} from "../app-routing.module";
import {Router} from "@angular/router";
import {AnimationService} from "./animation.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../components/dialogs/confirmation-dialog/confirmation-dialog.component";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private animationService: AnimationService,
    private auth: AuthService,
  ) { }

  public goTo(path: typeof routes[number]['path'], param?: string | number | boolean) {
    if (path === '..' || routes.find(route => route.path === path)) {
      if (this.animationService.leaveAnimation) return;
      if (this.router.url === `/${path}`) return;
      this.animationService.animate().then(() => {
        this.router.navigate(param ? [path, param] : [path]).then();
      })
    } else {
      console.error(`No available path found for: ${path}`);
    }
  }

  public back = (): void => {
  }

  public home = (): void => {
    if (!this.auth.portalUser) {
      this.goTo('explore');
    } else {
      this.goTo('');
    }
  }

  public confirmationDialog = (message: string): MatDialogRef<ConfirmationDialogComponent> => {
    return this.dialog.open(ConfirmationDialogComponent, {data: { message}, disableClose: true})
  }



}
