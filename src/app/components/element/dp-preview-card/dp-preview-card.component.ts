import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MetadataPreview} from "../../../model/common/MetadataPreview";
import {FileType} from "../../../model/enum/FileType";
import {getFileSizeStringFromSize} from "../../../consts/misc";
import {AuthService} from "../../../services/auth.service";
import {DataSourceStatus} from "../../../model/enum/DataSourceStatus";
import {GlobalService} from "../../../services/global.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'DPPreviewCard',
  templateUrl: './dp-preview-card.component.html',
  styleUrls: ['./dp-preview-card.component.css']
})
export class DpPreviewCardComponent implements OnInit {

  @Input() public previewUid?: string;
  @Input() public preview?: MetadataPreview;
  @Input() public editEnabled = true;
  @Input() public deleteEnabled = true;
  @Input() public disableView = false;
  @Output() public onEdit: EventEmitter<MetadataPreview> = new EventEmitter<MetadataPreview>();
  @Output() public onDelete: EventEmitter<MetadataPreview> = new EventEmitter<MetadataPreview>();
  @Output() public onClick: EventEmitter<MetadataPreview> = new EventEmitter<MetadataPreview>();
  public FileType = FileType;
  public DataSourceStatus = DataSourceStatus;
  public fileSizeString = '';

  constructor(
    public auth: AuthService,
    public store: AngularFirestore,
    public global: GlobalService,
  ) {
  }

  ngOnInit(): void {

    if (this.previewUid && !this.preview) {
      this.store.collection('metadata_preview').doc(this.previewUid).get().subscribe(snap => {
        this.preview = snap.data() as MetadataPreview;
        this. ngOnInit();
      })
      return;
    }


    if (this.preview?.size) this.fileSizeString = getFileSizeStringFromSize(this.preview.size);
  }

  public editClick = (): void => {
    this.onEdit.emit(this.preview);
  }
  public deleteClick = (): void => {
    this.onDelete.emit(this.preview);
  }
  public click = (): void => {
    this.onClick.emit(this.preview);
    if (this.disableView) return;
    this.global.goTo('view', this.preview!.uid);
  }

}
