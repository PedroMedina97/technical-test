import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { UsersComponent } from './modules/users/users.component';
import { FormUserComponent } from './modules/users/form-user/form-user.component';
import { HomeComponent } from './modules/home/home.component';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'users', component: UsersComponent},
    { path: 'create-user', component: FormUserComponent},
    { path: 'edit-user/:id', component: FormUserComponent},
    {path: '**', redirectTo: 'login'}
];
