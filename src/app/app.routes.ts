import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { UsersComponent } from './modules/users/users.component';
import { FormUserComponent } from './modules/users/form-user/form-user.component';
import { UserDetailComponent } from './modules/users/user-detail/user-detail.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuard]},
    {path: 'create-user', component: FormUserComponent, canActivate: [AuthGuard], data: { permission: 'create' }},
    {path: 'edit-user/:id', component: FormUserComponent, canActivate: [AuthGuard], data: { permission: 'update' }},
    {path: '**', redirectTo: 'login'}
];
