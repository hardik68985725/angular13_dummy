import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MediaService } from 'src/app/panel/components/media/media.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {
  @Input('Media') Media: any;
  @Input('MediaWhere') MediaWhere: any;
  @Output('OnMediaChange') OnMediaChange: EventEmitter<any> =
    new EventEmitter();

  IsLoading: boolean = false;
  FileErrors: any = [];
  SelectedFiles: any = [];

  constructor(private _MediaService: MediaService) {}
  ngOnInit(): void {}

  ChangeFiles(p_Event: any) {
    console.log(p_Event);

    const FileSizeLimit = 1024 * 1024 * 1; // in bytes
    const FileTypeAllowed = ['image/png', 'image/jpeg'];
    const Files = p_Event.target.files;
    this.FileErrors = [];
    this.SelectedFiles = [];
    for (let i = 0; i < Files.length; i++) {
      if (Files[i].size > FileSizeLimit) {
        this.FileErrors.push('File size more than 1MB is not allowed');
        break;
      }

      if (!(FileTypeAllowed.indexOf(Files[i].type) > -1)) {
        this.FileErrors.push('Only jpg and png file types are allowed');
        break;
      }

      this.SelectedFiles.push(Files[i]);
    }
  }

  async UploadFiles() {
    // FILE UPLOAD
    const _FormData = new FormData();
    _FormData.append('where', this.MediaWhere);
    if (this.SelectedFiles && this.SelectedFiles.length > 0) {
      for (let i = 0; i < this.SelectedFiles.length; i++) {
        _FormData.append('file', this.SelectedFiles[i]);
      }
    }
    // /FILE UPLOAD

    this.IsLoading = true;
    const response: any = await this._MediaService.upload(_FormData);
    console.log(response);

    if (response && response.status) {
      response.data.thumbnail = environment.api_url.concat(
        '/',
        response.data.thumbnail
      );
    }

    this.OnMediaChange.emit(response);
    this.IsLoading = false;
  }
}
