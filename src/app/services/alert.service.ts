import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  constructor() {}

  /**
   * Show success alert
   */
  success(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'success',
      message,
      title,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  /**
   * Show error alert
   */
  error(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'danger',
      message,
      title,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  /**
   * Show warning alert
   */
  warning(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'warning',
      message,
      title,
      dismissible: true,
      autoClose: true,
      duration: 7000,
      ...options
    });
  }

  /**
   * Show info alert
   */
  info(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'info',
      message,
      title,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  /**
   * Add alert to the list
   */
  private addAlert(alert: Omit<Alert, 'id'>): void {
    const alerts = this.alertsSubject.value;
    const newAlert: Alert = {
      id: this.generateId(),
      ...alert
    };
    
    this.alertsSubject.next([...alerts, newAlert]);

    // Auto close if enabled
    if (newAlert.autoClose && newAlert.duration) {
      setTimeout(() => {
        this.removeAlert(newAlert.id);
      }, newAlert.duration);
    }
  }

  /**
   * Remove alert by id
   */
  removeAlert(id: string): void {
    const alerts = this.alertsSubject.value.filter(alert => alert.id !== id);
    this.alertsSubject.next(alerts);
  }

  /**
   * Clear all alerts
   */
  clearAll(): void {
    this.alertsSubject.next([]);
  }

  /**
   * Get current alerts
   */
  getAlerts(): Alert[] {
    return this.alertsSubject.value;
  }

  /**
   * Generate unique id for alerts
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}