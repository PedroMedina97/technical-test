import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';
import { TranslationService, Language } from '../../../services/translation.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  currentRoute = '';
  currentUser: User | null = null;
  private userSubscription: Subscription = new Subscription();
  currentLanguage: Language = 'es';
  availableLanguages: { code: Language; name: string }[] = [];

  navigationItems: NavigationItem[] = [
    {
      path: '/home',
      icon: 'bi-house-door',
      label: 'navigation.home',
      isActive: false
    },
    {
      path: '/users',
      icon: 'bi-people',
      label: 'navigation.users',
      isActive: false
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
    this.updateActiveRoute();
    this.router.events.subscribe(() => {
      this.updateActiveRoute();
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user: User | null) => this.currentUser = user
    );
    
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.availableLanguages = this.translationService.getAvailableLanguages();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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

  logout() {
    this.authService.logout();
  }

  getUserRoleLabel(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === 'manager' ? 'Manager' : 'Coordinador';
  }

  changeLanguage(language: Language): void {
    this.currentLanguage = language;
    this.translationService.setLanguage(language);
  }
}
