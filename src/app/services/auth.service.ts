import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import usersData from './users.json';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'manager' | 'coordinator';
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly STORAGE_KEY = 'currentUser';
  private readonly users: User[] = usersData as User[];

  constructor(private router: Router) {

    this.loadUserFromStorage();
  }


  login(credentials: LoginCredentials): { success: boolean; message: string; user?: User } {
    const { usernameOrEmail, password } = credentials;
    
    // Find user by username or email
    const user = this.users.find(u => 
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase()) ||
      (u.email.toLowerCase() === usernameOrEmail.toLowerCase())
    );

    if (!user) {
      return {
        success: false,
        message: 'Usuario o email no encontrado'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Contraseña incorrecta'
      };
    }

    // Login successful
    this.setCurrentUser(user);
    return {
      success: true,
      message: `Bienvenido ${user.name}`,
      user: user
    };
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if current user has manager role
   */
  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'manager';
  }

  /**
   * Check if current user has coordinator role
   */
  isCoordinator(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'coordinator';
  }

  /**
   * Check if user can perform create operations
   */
  canCreate(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Check if user can perform read operations
   */
  canRead(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Check if user can perform update operations
   */
  canUpdate(): boolean {
    return this.isManager();
  }

  /**
   * Check if user can perform delete operations
   */
  canDelete(): boolean {
    return this.isManager();
  }

  /**
   * Set current user and save to localStorage
   */
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Load user from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}