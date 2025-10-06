import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedUsersService {
  private featuredUsersSubject = new BehaviorSubject<User[]>([]);
  public featuredUsers$ = this.featuredUsersSubject.asObservable();

  private readonly STORAGE_KEY = 'featuredUsers';

  constructor() {
    this.loadFeaturedUsers();
  }

  private loadFeaturedUsers(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const featuredUsers = stored ? JSON.parse(stored) : [];
    this.featuredUsersSubject.next(featuredUsers);
  }

  private saveFeaturedUsers(featuredUsers: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(featuredUsers));
    this.featuredUsersSubject.next(featuredUsers);
  }

  getFeaturedUsers(): User[] {
    return this.featuredUsersSubject.value;
  }

  addFeaturedUser(user: User): boolean {
    const currentFeatured = this.getFeaturedUsers();
    
    if (currentFeatured.some(featured => featured.id === user.id)) {
      return false;
    }

    const updatedFeatured = [...currentFeatured, user];
    this.saveFeaturedUsers(updatedFeatured);
    return true;
  }

  removeFeaturedUser(userId: number): boolean {
    const currentFeatured = this.getFeaturedUsers();
    const updatedFeatured = currentFeatured.filter(user => user.id !== userId);
    
    if (updatedFeatured.length === currentFeatured.length) {
      return false;
    }

    this.saveFeaturedUsers(updatedFeatured);
    return true;
  }

  isUserFeatured(userId: number): boolean {
    return this.getFeaturedUsers().some(user => user.id === userId);
  }

  getFeaturedUsersCount(): number {
    return this.getFeaturedUsers().length;
  }
}
