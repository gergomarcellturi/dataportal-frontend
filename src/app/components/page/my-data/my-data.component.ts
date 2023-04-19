import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AnimationService} from "../../../services/animation.service";
import {FadeOutDirective} from "../../../directives/fade-out.directive";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import { MetadataPreview } from 'src/app/model/common/MetadataPreview';
import {AuthService} from "../../../services/auth.service";
import {AuthApiService} from "../../../services/api/auth-api.service";

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

  public $metadataPreviews?: Observable<MetadataPreview[]>;
  public elements?: QueryList<ElementRef>;
  private searchString?: string;
  public isLoading = false;

  constructor(
    public animationService: AnimationService,
    public global: GlobalService,
    public store: AngularFirestore,
    public auth: AuthService,
    public authApi: AuthApiService,
  ) {
    authApi.getCurrentUser().subscribe(user => {
      this.$metadataPreviews = store.collection<MetadataPreview>('metadata_preview',
        ref => ref.where('userUid', '==', user.uid)).valueChanges();

    });
  }

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

  previewFilter = (preview: MetadataPreview): boolean => {
   if (!this.searchString) return true;
   if (preview.title.toLowerCase().includes(this.searchString.toLowerCase())) return true;
   if (preview.summary.toLowerCase().includes(this.searchString.toLowerCase())) return true;
   return false;
  }

  public click = (preview: MetadataPreview): void => {
    console.log(preview);
  }

  public delete = (preview: MetadataPreview): void => {
    console.log(preview);
  }

}
