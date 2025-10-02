import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FeaturedUsersService, User } from '../../services/featured-users.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  showModal = false;
  featuredUsers: User[] = [];
  private featuredUsersSubscription: Subscription = new Subscription();
  
  // Filter properties
  nameFilter = '';
  emailFilter = '';
  
  constructor(
    private usersService: UsersService,
    private featuredUsersService: FeaturedUsersService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {

  }
  
  ngOnInit() {
    this.getUsers();
    this.loadFeaturedUsers();
  }

  ngOnDestroy() {
    this.featuredUsersSubscription.unsubscribe();
  }

  private loadFeaturedUsers() {
    this.featuredUsersSubscription = this.featuredUsersService.featuredUsers$.subscribe(
      featuredUsers => {
        this.featuredUsers = featuredUsers;
      }
    );
  }
  
  getUsers() {
    this.usersService.getUsers().subscribe(
      (data: any) => {
        this.users = data as User[];
        this.filteredUsers = [...this.users];
        console.log(JSON.stringify(this.users));
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(this.emailFilter.toLowerCase());
      return nameMatch && emailMatch;
    });
  }
  
  clearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.filteredUsers = [...this.users];
  }
  
  showUserDetails(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  addToFeatured(user: User) {
    const success = this.featuredUsersService.addFeaturedUser(user);
    if (success) {
      console.log(`Usuario ${user.name} agregado a destacados`);
    } else {
      console.log(`Usuario ${user.name} ya está en destacados`);
    }
  }

  removeFromFeatured(userId: number) {
    const success = this.featuredUsersService.removeFeaturedUser(userId);
    if (success) {
      console.log(`Usuario eliminado de destacados`);
    }
  }

  isUserFeatured(userId: number): boolean {
    return this.featuredUsersService.isUserFeatured(userId);
  }

  viewUserDetails(user: User) {
    this.router.navigate(['/users', user.id]);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  // Role-based permission methods
  canCreate(): boolean {
    return this.authService.canCreate();
  }

  canUpdate(): boolean {
    return this.authService.canUpdate();
  }

  canDelete(): boolean {
    return this.authService.canDelete();
  }

  canView(): boolean {
    return this.authService.canRead();
  }

  // Enhanced methods with role checks
  addToFeaturedWithPermission(user: User) {
    if (!this.canView()) {
      this.alertService.warning('No tienes permisos para realizar esta acción', 'Acceso denegado');
      return;
    }
    this.addToFeatured(user);
  }

  removeFromFeaturedWithPermission(userId: number) {
    if (!this.canView()) {
      this.alertService.warning('No tienes permisos para realizar esta acción', 'Acceso denegado');
      return;
    }
    this.removeFromFeatured(userId);
  }
}
