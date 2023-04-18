import {ChangeDetectorRef, Injectable} from '@angular/core';
import {routes} from "../app-routing.module";
import {Router} from "@angular/router";
import {AnimationService} from "./animation.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    public router: Router,
    private animationService: AnimationService,
  ) { }

  public goTo(path: typeof routes[number]['path']) {
    if (routes.find(route => route.path === path)) {
      if (this.animationService.leaveAnimation) return;
      if (this.router.url === `/${path}`) return;
      this.animationService.animate().then(() => {
        this.router.navigate([path]).then();
      })
    } else {
      console.error(`No available path found for: ${path}`);
    }
  }





}
