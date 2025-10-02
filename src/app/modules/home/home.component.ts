import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

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
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  showModal = false;
  
  // Filter properties
  nameFilter = '';
  emailFilter = '';
  
  constructor(private usersService: UsersService) {

  }
  
  ngOnInit() {
    this.getUsers();
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
}
