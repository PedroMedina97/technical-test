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

    this.setCurrentUser(user);
    return {
      success: true,
      message: `Bienvenido ${user.name}`,
      user: user
    };
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'manager';
  }

  isCoordinator(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'coordinator';
  }

  canCreate(): boolean {
    return this.isLoggedIn();
  }

  canRead(): boolean {
    return this.isLoggedIn();
  }

  canUpdate(): boolean {
    return this.isManager();
  }

  canDelete(): boolean {
    return this.isManager();
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

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