import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';



export const appRoutes: Routes = [
  { path : '' , component: HomeComponent},
  //This approach OR
  // { path : 'members' , component: MemberListComponent, canActivate: [AuthGuard]},
  // { path : 'members' , component: MemberListComponent, canActivate: [AuthGuard]},
  // { path : 'members' , component: MemberListComponent, canActivate: [AuthGuard]},
  // This for large applications
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path : 'members' , component: MemberListComponent},
      { path : 'messages' , component: MessagesComponent},
      { path : 'lists' , component: ListComponent},
    ]
  },
  
  { path : '**' , redirectTo: '' , pathMatch: 'full'},
];