import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { FileArchiver } from '@udonarium/core/file-storage/file-archiver';
import { ImageContext, ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem, Network } from '@udonarium/core/system';

import { PanelService } from 'service/panel.service';

@Component({
  selector: 'file-storage',
  templateUrl: './file-storage.component.html',
  styleUrls: ['./file-storage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileStorageComponent implements OnInit, OnDestroy, AfterViewInit {

  uploadImgUrl: string = "";

  fileStorageService = ImageStorage.instance;
  constructor(
    private changeDetector: ChangeDetectorRef,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    this.panelService.title = '檔案一覽';
  }

  ngAfterViewInit() {
    EventSystem.register(this).on('SYNCHRONIZE_FILE_LIST', event => {
      if (event.isSendFromSelf) {
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  handleFileSelect(event: Event) {
    let files = (<HTMLInputElement>event.target).files;
    if (files.length) FileArchiver.instance.load(files);
  }

  onSelectedFile(file: ImageFile) {
    console.log('onSelectedFile', file);
    EventSystem.call('SELECT_FILE', { fileIdentifier: file.identifier }, Network.peerId);
  }

  uploadByUrl() {
    let testFile: ImageFile = null;
    let fileContext: ImageContext = null;
    fileContext = ImageFile.createEmpty(this.uploadImgUrl).toContext();
    fileContext.url = this.uploadImgUrl;
    fileContext.name = this.uploadImgUrl;
    testFile = ImageStorage.instance.add(fileContext);
    this.uploadImgUrl = "";
  }
  deleteErrorFile(file: ImageFile){
    alert("圖片上傳失敗!");
    console.log("Delete file: "+file.identifier);
    ImageStorage.instance.delete(file.identifier);
  }

  isWatchMode(): boolean { return Network.isSelfWatchMode(); }
}
