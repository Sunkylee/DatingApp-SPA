import { AuthService } from './../../_services/auth.service';
import { UserService } from './../../_services/user.service';
import { AlertifyService } from './../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm',{static: true}) editform: NgForm;
  user: User;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
     if(this.editform.dirty){
           $event.returnValue = true;
     }
  }

  constructor(private route: ActivatedRoute,
     private alertify: AlertifyService,
     private userService: UserService,
     private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next =>{
      this.alertify.success("profile updated successfully")
      this.editform.reset(this.user);
    }, error => {
      this.alertify.error(error)
    });
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
  }

}