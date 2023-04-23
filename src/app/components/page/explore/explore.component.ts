import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList} from '@angular/core';
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AnimationService} from "../../../services/animation.service";
import {GlobalService} from "../../../services/global.service";
import {ExploreService} from "../../../services/explore.service";

@Component({
  selector: 'app-browse',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave],
})
export class ExploreComponent implements OnInit, OnDestroy {
  set fadeOutOnLeaveAnimation(query: QueryList<ElementRef<HTMLDivElement>>) {
    this.animationService.add(query, this);
  }

  public isLoading = false;

  constructor(
    public animationService: AnimationService,
    public global: GlobalService,
    public cd: ChangeDetectorRef,
    public exploreSevice: ExploreService,
  ) {

  }

  ngOnInit(): void {
    this.exploreSevice.refresh();
  }

  ngOnDestroy() {
    this.animationService.destroy(this);
  }

  public expand = (): void => {
    this.isLoading = true;
    this.cd.detectChanges();
    this.exploreSevice.expand();
    this.isLoading = false;
  }


}
