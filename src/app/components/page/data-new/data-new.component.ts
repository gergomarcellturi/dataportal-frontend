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
  public metadata?: Metadata;
  public isLoading = false;
  public EditorClassic = ClassicEditor;
  public content?: string;
  public name?: string;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: {name: string}[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  constructor(
    public animationService: AnimationService,
    public portalApiService: PortalApiService,
    public dataApiService: DataApiService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.animationService.destroy(this);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: {name: string}): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  edit(fruit: {name: string}, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }

  metadataChange = (metadata: Metadata | null) => {
    if (metadata) this.metadata = metadata;
    else this.metadata = undefined;
  }

}
