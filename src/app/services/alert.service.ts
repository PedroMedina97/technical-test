import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslationService } from './translation.service';

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

  constructor(private translationService: TranslationService) {}

  success(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'success',
      message: this.translateMessage(message),
      title: title ? this.translateMessage(title) : undefined,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  error(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'danger',
      message: this.translateMessage(message),
      title: title ? this.translateMessage(title) : undefined,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  warning(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'warning',
      message: this.translateMessage(message),
      title: title ? this.translateMessage(title) : undefined,
      dismissible: true,
      autoClose: true,
      duration: 7000,
      ...options
    });
  }

  info(message: string, title?: string, options?: Partial<Alert>): void {
    this.addAlert({
      type: 'info',
      message: this.translateMessage(message),
      title: title ? this.translateMessage(title) : undefined,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...options
    });
  }

  private addAlert(alert: Omit<Alert, 'id'>): void {
    const alerts = this.alertsSubject.value;
    const newAlert: Alert = {
      id: this.generateId(),
      ...alert
    };
    
    this.alertsSubject.next([...alerts, newAlert]);

    if (newAlert.autoClose && newAlert.duration) {
      setTimeout(() => {
        this.removeAlert(newAlert.id);
      }, newAlert.duration);
    }
  }

  removeAlert(id: string): void {
    const alerts = this.alertsSubject.value.filter(alert => alert.id !== id);
    this.alertsSubject.next(alerts);
  }

  clearAll(): void {
    this.alertsSubject.next([]);
  }

  getAlerts(): Alert[] {
    return this.alertsSubject.value;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private translateMessage(message: string): string {
    if (message.includes('.')) {
      return this.translationService.translate(message);
    }
    return message;
  }
}