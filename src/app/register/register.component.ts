import { AuthService } from './../_services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model:any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

   register(){
    this.authService.register(this.model).subscribe(() => {
      console.log("registration successful");
    }, error => {
      console.log(error)
    });
   }

   cancel(){
     this.cancelRegister.emit(false)
    console.log("registration form cancelled");
   }



}
