import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {zip} from "rxjs";
import {DataApiService} from "../../../services/api/data-api.service";
import {GlobalService} from "../../../services/global.service";
import {Metadata} from "../../../model/storage/Metadata";
import {DatasourceDetails} from "../../../model/storage/DatasourceDetails";
import {fadeInFromTop, fadeOutOnLeave} from "../../../consts/animations";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {User} from "../../../model/User";
import {AuthService} from "../../../services/auth.service";
import {DataSourceStatus} from "../../../model/enum/DataSourceStatus";

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  animations: [fadeInFromTop, fadeOutOnLeave]
})
export class DataViewComponent implements OnInit, AfterViewInit {

  public metadata?: Metadata;
  public uploader?: User;
  public datasourceDetails?: DatasourceDetails;
  public isLoading = false;
  public DataSourceStatus = DataSourceStatus;
  public content?: string;

  constructor(
    private route: ActivatedRoute,
    public dataApiService: DataApiService,
    public authApi: AuthApiService,
    public auth: AuthService,
    public global: GlobalService,
  ) {
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
        this.metadata = result[0].data;
        this.datasourceDetails = result[1].data;

        if (!this.metadata?.uid) return;
        this.authApi.getUserByUid(this.metadata.userUid).subscribe(user => {
          this.uploader = user;
        })
      })
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

}
