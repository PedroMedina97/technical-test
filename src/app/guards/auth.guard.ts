import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check role-based permissions if specified in route data
    const requiredRole = route.data['role'];
    if (requiredRole) {
      const user = this.authService.getCurrentUser();
      if (!user || user.role !== requiredRole) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    // Check specific permissions if specified in route data
    const requiredPermission = route.data['permission'];
    if (requiredPermission) {
      let hasPermission = false;
      
      switch (requiredPermission) {
        case 'create':
          hasPermission = this.authService.canCreate();
          break;
        case 'read':
          hasPermission = this.authService.canRead();
          break;
        case 'update':
          hasPermission = this.authService.canUpdate();
          break;
        case 'delete':
          hasPermission = this.authService.canDelete();
          break;
        default:
          hasPermission = true;
      }

      if (!hasPermission) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}