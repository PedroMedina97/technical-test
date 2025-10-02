import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeaturedUsersService, User } from '../../services/featured-users.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  showDeleteModal = false;
  userToDelete: User | null = null;
  featuredUsers: User[] = [];
  private featuredUsersSubscription: Subscription = new Subscription();
  
  nameFilter = '';
  emailFilter = '';
  companyFilter = '';
  
  isLoading = false;
  isDeleting = false;
  
  constructor(
    private router: Router,
    private featuredUsersService: FeaturedUsersService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadUsers();
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

  private loadUsers() {
    this.isLoading = true;
    
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
      this.filteredUsers = [...this.users];
      this.isLoading = false;
      console.log('Users loaded from localStorage');
    } else {
      this.loadInitialUsers();
    }
  }

  private loadInitialUsers() {
    const initialUsers: User[] = [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        address: {
          street: "Kulas Light",
          suite: "Apt. 556",
          city: "Gwenborough",
          zipcode: "92998-3874",
          geo: {
            lat: "-37.3159",
            lng: "81.1496"
          }
        },
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
        company: {
          name: "Romaguera-Crona",
          catchPhrase: "Multi-layered client-server neural-net",
          bs: "harness real-time e-markets"
        }
      }
    ];

    this.users = initialUsers;
    this.filteredUsers = [...this.users];
    this.saveToLocalStorage();
    this.isLoading = false;
    console.log('Initial users loaded and saved to localStorage');
  }

  private saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(this.emailFilter.toLowerCase());
      const companyMatch = user.company.name.toLowerCase().includes(this.companyFilter.toLowerCase());
      return nameMatch && emailMatch && companyMatch;
    });
  }

  clearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.companyFilter = '';
    this.filteredUsers = [...this.users];
  }

  showUserDetails(user: User) {
    this.router.navigate(['/users', user.id]);
  }

  editUser(user: User) {
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.isDeleting = true;
      
      this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
      this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.userToDelete!.id);
      
      this.saveToLocalStorage();
      
      this.isDeleting = false;
      this.showDeleteModal = false;
      this.userToDelete = null;
      
      console.log('User deleted successfully');
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  getNextId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
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

  deleteUserWithPermission(user: User) {
    if (!this.canDelete()) {
      this.alertService.warning('No tienes permisos para eliminar usuarios', 'Acceso denegado');
      return;
    }
    this.deleteUser(user);
  }

  editUserWithPermission(user: User) {
    if (!this.canUpdate()) {
      this.alertService.warning('No tienes permisos para editar usuarios', 'Acceso denegado');
      return;
    }
    this.editUser(user);
  }
}
