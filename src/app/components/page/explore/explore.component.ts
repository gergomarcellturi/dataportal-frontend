import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList} from '@angular/core';
import {AngularFirestore, Query} from "@angular/fire/compat/firestore";
import {MetadataPreview} from "../../../model/common/MetadataPreview";
import {Observable, of} from "rxjs";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AnimationService} from "../../../services/animation.service";

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
  public exploreItems: MetadataPreview[] = [];
  $exploreItems?: Observable<MetadataPreview[]>;
  public isLoading = false;
  public limit = 5;
  constructor(
    public store: AngularFirestore,
    public animationService: AnimationService,
    public cd: ChangeDetectorRef,
  ) {
    this.setSubscription();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.animationService.destroy(this);
  }

  public setSubscription = (): void => {
    this.isLoading = true;
    this.store
      .collection<MetadataPreview>('metadata_preview', ref => ref.where('status', '==', 'PUBLISHED').limit(this.limit)).valueChanges()
      .subscribe(previews => {
      const offset = this.exploreItems.length;
      for (let i = offset; i < this.limit; i++) {
        if (previews[i])
          this.exploreItems.push(previews[i]);
      }
      this.isLoading = false;
      });
  }

  expand() {
    this.isLoading = true;
    this.cd.detectChanges();
    this.limit = this.limit + 1;
    this.setSubscription();
  }
}
