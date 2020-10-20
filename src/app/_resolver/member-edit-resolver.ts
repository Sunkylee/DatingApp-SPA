import { AuthService } from './../_services/auth.service';
import { Observable, of } from 'rxjs';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private authservise: AuthService,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(this.authservise.decodedToken.nameid).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving your data');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
