import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isExpanded = false;
  currentRoute = '';

  navigationItems: NavigationItem[] = [
    {
      path: '/home',
      icon: 'bi-house-door',
      label: 'Inicio',
      isActive: false
    },
    {
      path: '/users',
      icon: 'bi-people',
      label: 'Usuarios',
      isActive: false
    }
  ];

  constructor(private router: Router) {
    this.updateActiveRoute();
    this.router.events.subscribe(() => {
      this.updateActiveRoute();
    });
  }

  private updateActiveRoute() {
    this.currentRoute = this.router.url;
    this.navigationItems.forEach(item => {
      item.isActive = this.currentRoute === item.path;
    });
  }

  onMouseEnter() {
    this.isExpanded = true;
  }

  onMouseLeave() {
    this.isExpanded = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
