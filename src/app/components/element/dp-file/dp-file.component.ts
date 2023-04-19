import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  getFileSizeStringFromFile,
  getFileSizeStringFromSize,
  getFileType,
  getFileTypeString
} from "../../../consts/misc";
import {FileType} from "../../../model/enum/FileType";
import {LoadProgress} from "../../../model/common/LoadProgress";
import {DataApiService} from "../../../services/api/data-api.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FileInitRequest} from "../../../model/request/FileInitRequest";
import {Metadata} from "../../../model/storage/Metadata";
import {PortalApiService} from "../../../services/api/portal-api.service";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";

@Component({
  selector: 'DPFile',
  templateUrl: './dp-file.component.html',
  styleUrls: ['./dp-file.component.css']
})
export class DpFileComponent implements OnInit {

  @Input() public file?: File;
  @Input() public disableDownload = false;
  @Input() public confirmationRequired = false;
  @Input() public icon = 'upload';
  @Input() public clearable = true;
  @Input() public metadata?: Metadata;
  @Output() public fileChange: EventEmitter<File | undefined> = new EventEmitter<File | undefined>();
  @Output() public onConfirm: EventEmitter<File> = new EventEmitter<File>();
  @Output() public onClear: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMetadataChange: EventEmitter<Metadata | null> = new EventEmitter<Metadata | null>();
  @Output() public onLoadProgress: EventEmitter<LoadProgress> = new EventEmitter<LoadProgress>();
  @Output() public onUploaded: EventEmitter<Metadata> = new EventEmitter<Metadata>();
  public uploadStatus: 'UPLOADING' | 'NONE' | 'FINISHED' | 'INTERRUPTED' | 'SAVING' = 'NONE';
  public spinnerType: ProgressSpinnerMode = 'indeterminate';
  public reloaded = false;
  public isLoading = false;
  public loadingProgress: number | null = 0;
  public confirmed = false;
  public fileName = '';
  public fileSizeString = '';
  public fileTypeString = '';
  public fileType?: FileType;
  private canUpload = false;
  constructor(
    public dataApiService: DataApiService,
    public store: AngularFirestore,
    public portalApiService: PortalApiService,
  ) {
    this.reloaded = !!this.file;
  }

  ngOnInit(): void {
    this.confirmed = !this.confirmationRequired || this.reloaded;
    this.fileChange.subscribe(file => {
      this.updateFileDetails(file);
    });
    this.onMetadataChange.subscribe(() => {
      if (!this.metadata) return;
      if (!this.confirmationRequired && this.canUpload) this.initUpload();
      this.fileSizeString = getFileSizeStringFromSize(this.metadata.size);
    })

    if (this.metadata) this.onMetadataChange.emit(this.metadata);
    this.canUpload = true;
  }

  public download = (): void => {
    if (!this.metadata?.uid) return;
    this.dataApiService.downloadFile(this.metadata?.uid);
  }

  public confirm = () => {
    this.confirmed = true;
    this.onConfirm.emit(this.file);
    if (this.confirmationRequired) this.initUpload();
  }

  public onFileChange = (event: Event): void => {
    const files = (event?.target as any).files as FileList | null;
    if (files && files.length > 0) {
      this.file = files[0];
      this.fileType = getFileType(this.file);
    } else {
      this.file = undefined;
      this.fileType = undefined;
    }
    if (!this.confirmationRequired) this.confirm();
    this.fileChange.emit(this.file);

  }

  public clear = (fileInput: HTMLInputElement): void => {
    this.file = undefined;
    this.fileType = undefined;
    fileInput.files = null;
    fileInput.value = '';
    this.confirmed = !this.confirmationRequired;
    this.fileChange.emit(this.file);
    this.onClear.emit();
  }

  public updateFileDetails = (file: File | undefined): void => {
    if (file) {
      this.fileSizeString = getFileSizeStringFromFile(file);
      this.fileName = file.name
      this.fileTypeString = getFileTypeString(file)!;
    } else {
      this.fileSizeString = '';
      this.fileName = '';
      this.fileTypeString = ';'
    }
    this.updateMetadata();
  }

  public updateMetadata = (): void => {
    if (!this.file) {
      this.onMetadataChange.emit(null);
      return;
    }
    this.isLoading = true;
    this.portalApiService.initupload(this.createUploadRequest()).subscribe(result => {
      if (result) {
        this.metadata = result;
        this.onMetadataChange.emit(this.metadata);
      }
      this.isLoading = false;
    })
  }


  public initUpload = (): void => {
    this.isLoading = true;
    this.spinnerType = 'indeterminate';
    const formData = new FormData();
    formData.append('file', this.file!);
    this.dataApiService.uploadFile({metadataId: this.metadata!.uid}, formData).subscribe(result => {
      const uploadResponse = result.data;
      if (!uploadResponse) return;
      this.isLoading = true;
      this.loadingProgress = 0;
      const monitor = this.store.collection('progress').doc<LoadProgress>(uploadResponse.monitorId)
        .valueChanges().subscribe(data => {
          console.log(data);
          if (!data) return;
          this.uploadStatus = data.status;
          switch (data.status) {
            case "UPLOADING":
              this.spinnerType = 'determinate';
              this.loadingProgress = data.progress;
              return;
            case "INTERRUPTED":
              this.isLoading = false;
              this.loadingProgress = 100;
              monitor.unsubscribe();
              return;
            case "SAVING":
              this.spinnerType = 'indeterminate';
              this.loadingProgress = null;
              return;
            case "FINISHED":
              this.isLoading = false;
              this.loadingProgress = 100;
              this.onUploaded.emit(this.metadata);
              monitor.unsubscribe();
              setTimeout(() => {
                this.uploadStatus = 'NONE';
              }, 3000)
              return;
          }
        })
    })
  }

  public createUploadRequest = (): FileInitRequest => {
    return {
      filename: this.file!.name,
      fileSize: this.file!.size,
      fileType: getFileType(this.file!)!,
    }
  }
}
