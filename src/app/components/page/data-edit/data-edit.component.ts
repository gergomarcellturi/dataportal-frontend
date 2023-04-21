import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {ActivatedRoute} from "@angular/router";
import {GlobalService} from "../../../services/global.service";
import {Metadata} from "../../../model/storage/Metadata";
import {DataApiService} from "../../../services/api/data-api.service";
import {zip} from "rxjs";
import {DatasourceDetails} from "../../../model/storage/DatasourceDetails";
import {MatChipInputEvent} from "@angular/material/chips";
import {Tag} from "../../../model/storage/Tag";
import {FadeOutDirective} from "../../../directives/fade-out.directive";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {AnimationService} from "../../../services/animation.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {DataSourceStatus} from "../../../model/enum/DataSourceStatus";
import {ckeditorConfig} from "../../../consts/misc";
import {DataAccess} from "../../../model/enum/DataAccess";
import {DataDownloadAccess} from "../../../model/enum/DataDownloadAccess";

@Component({
  selector: 'app-data-edit',
  templateUrl: './data-edit.component.html',
  styleUrls: ['./data-edit.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave],
})
export class DataEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FadeOutDirective)
  set fadeOutOnLeaveAnimation(query: QueryList<ElementRef<HTMLDivElement>>) {
    this.animationService.add(query, this);
  }
  public DataSourceStatus = DataSourceStatus;
  public DataAccess = DataAccess;
  public DataDownloadAccess = DataDownloadAccess;
  public EditorClassic = ClassicEditor;
  public metadata?: Metadata;
  public datasourceDetails?: DatasourceDetails;
  public isLoading = false;
  public ckeditorConfig = ckeditorConfig;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    public global: GlobalService,
    public animationService: AnimationService,
    public dataApiService: DataApiService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const {uid} = params;
      if (!uid) {
        this.global.goTo('/');
        return;
      }

      zip(
        this.dataApiService.getMetadataById(uid),
        this.dataApiService.getDatasourceDetailsByMetadataId(uid)
      ).subscribe(result => {
        console.log(result);
        this.metadata = result[0].data;
        this.datasourceDetails = result[1].data;
        this.isLoading = false;
      })


    })
  }

  ngAfterViewInit() {
    this.animationService.destroy(this);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.datasourceDetails?.tags.push({title: value} as Tag);
    }
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.datasourceDetails!.tags.indexOf(tag);

    if (index >= 0) {
      this.datasourceDetails?.tags.splice(index, 1);
    }
  }

  public save = (): void => {
    this.isLoading = true;
    this.dataApiService.updateDatasource({metadata: this.metadata, datasourceDetails: this.datasourceDetails}).subscribe(response => {
      this.isLoading = false;
      this.global.goTo('my-data');
    })
  }

  public delete = (): void => {
    if (!this.metadata) return;
    this.isLoading = true;
    this.global.confirmationDialog(`Are you sure you want to delete the following data: ${this.datasourceDetails?.title}`)
      .afterClosed().subscribe(response => {
        if (response) {
          this.dataApiService.deleteData(this.metadata!.uid).subscribe(deleteResponse => {
            if (deleteResponse) {
              this.global.goTo('my-data');
            }
            this.isLoading = false;
          })
        } else this.isLoading = false;
    })

  }
}
