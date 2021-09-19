import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Photo } from 'src/app/_models/photo';
import { ReqRes } from 'src/app/_models/reqres';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { PlayerService } from 'src/app/_services/player.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  user: User;
  uploader: FileUploader;
  baseUrl = environment.baseUrl;
  hasBaseDropZoneOver = false;
  imageLoaded = false;

  constructor(private accountService: AccountService, private playerService: PlayerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.initializeUploader();
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.imageLoaded = true;
    }

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.user.photo = photo;
        this.accountService.setCurrentUser(this.user);
        this.imageLoaded = false;
      }
    }
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  cancelUpload() {
    this.uploader.cancelAll();
    this.imageLoaded = false;
  }

  removeUpload() {
    this.uploader.clearQueue();
    this.imageLoaded = false;
  }

  deletePhoto(photoId: number) {
    this.playerService.deletePhoto(photoId).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
      this.user.photo = null;
      this.accountService.setCurrentUser(this.user);
    }, error => {
      this.toastr.error(error.error);
    });
  }

}
