import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Photo } from './../../_models/photo';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
 // @Output() getMemberPhotoChange =  new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  constructor(private authsService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authsService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;}

   this.uploader.onSuccessItem = (item, response, status, headers) => {
     if(response){

      const res: Photo = JSON.parse(response);
      const photo = {

        id: res.id,
        url: res.url,
        dateAdded: res.dateAdded,
        description: res.description,
        isMain: res.isMain
      };
      this.photos.push(photo);
      if (photo.isMain)
      {
        this.authsService.changeMemberPhoto(photo.url);
        this.authsService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authsService.currentUser));
      }
     }
   }

  }

   setMainPhoto(photo: Photo){
     this.userService.setMainPhoto(this.authsService.decodedToken.nameid, photo.id).subscribe(() => {
       this.currentMain = this.photos.filter(p => p.isMain === true)[0];
       this.currentMain.isMain = false;
       photo.isMain = true;
       this.authsService.changeMemberPhoto(photo.url);
       this.authsService.currentUser.photoUrl = photo.url;
       localStorage.setItem('user', JSON.stringify(this.authsService.currentUser));
       //this.getMemberPhotoChange.emit(photo.url)
     }, error => {
         this.alertify.error(error)
     });
   }

    deletePhoto(id: number){
          this.alertify.confirm("Are you sure you want to delete this photo", () =>{
            this.userService.deletePhoto(this.authsService.decodedToken.nameid, id).subscribe(() => {
              this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
              this.alertify.success("Photo has been deleted");
            }, error =>{
              this.alertify.error('Failed to delete the photo')
            })
          });
    }

}
