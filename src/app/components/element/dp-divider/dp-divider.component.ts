import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AnimationService} from "../../../services/animation.service";
import {dividerFade} from "../../../consts/animations";

@Component({
  selector: 'DPDivider',
  templateUrl: './dp-divider.component.html',
  styleUrls: ['./dp-divider.component.css'],
  animations: [dividerFade]
})
export class DpDividerComponent implements OnInit, OnDestroy {
  constructor(
    public animationService: AnimationService,
    private cd: ChangeDetectorRef
  ) { }
  public refreshView = (): void => {
    this.cd.detectChanges();
  }
  ngOnInit(): void {
    this.animationService.$stateChange.subscribe(() => {
      this.refreshView();
    })
  }
  ngOnDestroy() {
    this.animationService.destroy(this);
  }
}
