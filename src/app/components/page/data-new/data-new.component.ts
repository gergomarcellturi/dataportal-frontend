import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AnimationService} from "../../../services/animation.service";
import {FadeOutDirective} from "../../../directives/fade-out.directive";
import {PortalApiService} from "../../../services/api/portal-api.service";
import {DataApiService} from "../../../services/api/data-api.service";
import {Metadata} from "../../../model/storage/Metadata";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {DatasourceDetails} from "../../../model/storage/DatasourceDetails";
import {Tag} from "../../../model/storage/Tag";
import {GlobalService} from "../../../services/global.service";
import {ckeditorConfig} from "../../../consts/misc";

@Component({
  selector: 'app-data-new',
  templateUrl: './data-new.component.html',
  styleUrls: ['./data-new.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave],
})
export class DataNewComponent implements OnInit, OnDestroy {

  @ViewChildren(FadeOutDirective)
  set fadeOutOnLeaveAnimation(query: QueryList<ElementRef<HTMLDivElement>>) {
    this.animationService.add(query, this);
  }
  public EditorClassic = ClassicEditor;
  public ckeditorConfig = ckeditorConfig;
  public metadata?: Metadata;
  public isLoading = false;
  public description?: string;
  public title?: string;
  public summary?: string;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [];

  constructor(
    public animationService: AnimationService,
    public portalApiService: PortalApiService,
    public dataApiService: DataApiService,
    public global: GlobalService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.animationService.destroy(this);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push({title: value} as Tag);
    }
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  onUploaded = (metadata: Metadata | null) => {
    if (metadata) this.metadata = metadata;
    else this.metadata = undefined;
  }

  public save = () => {
    if (!this.title || !this.metadata) return;

    this.dataApiService.finalizeData({metadataId: this.metadata.uid}, {
      title: this.title,
      summary: this.summary,
      description: this.description,
      tags: this.tags,
    } as DatasourceDetails).subscribe(response => {
      const {data} = response;
      if (data) {
        this.metadata = data;
        this.global.goTo(`my-data/edit`, this.metadata.uid);
      }
    })
  }

}
