import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../../pipes/translate.pipe';

interface User {
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

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const users = this.getUsersFromStorage();
      this.user = users.find(u => u.id === +userId) || null;
      
      if (this.user) {
        this.isLoading = false;
      } else {
        this.router.navigate(['/users']);
      }
    } else {
      this.router.navigate(['/users']);
    }
  }

  private getUsersFromStorage(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }


  goBack() {
    this.router.navigate(['/users']);
  }

  editUser() {
    if (this.user) {
      this.router.navigate(['/edit-user', this.user.id]);
    }
  }
}
