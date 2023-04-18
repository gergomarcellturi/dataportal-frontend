import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AnimationService} from "../../../services/animation.service";
import {FadeOutDirective} from "../../../directives/fade-out.directive";

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave],
})
export class MyDataComponent implements OnInit {
  @ViewChildren(FadeOutDirective)
  set fadeOutOnLeaveAnimation(query: QueryList<ElementRef<HTMLDivElement>>) {
    this.animationService.add(query, this);
  }


  public elements?: QueryList<ElementRef>;
  private searchString?: string;
  public isLoading = false;

  constructor(
    public animationService: AnimationService,
    public global: GlobalService,
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.animationService.destroy(this);
  }



  public search = (searchString: string): void => {
    if (!searchString) {
      this.isLoading = false;
      this.searchString = '';
      return
    }

    this.searchString = searchString;
    this.isLoading = true;
    setTimeout(() => {
      if (!this.searchString) return;
      if (this.searchString !== searchString) return;
      else {
        // TODO
        this.isLoading = false;
      }
    }, 1000)
  }

}
