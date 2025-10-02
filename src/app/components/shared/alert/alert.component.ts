import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private alertsSubscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertsSubscription = this.alertService.alerts$.subscribe(
      alerts => this.alerts = alerts
    );
  }

  ngOnDestroy(): void {
    this.alertsSubscription.unsubscribe();
  }

  removeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }

  getAlertClass(alert: Alert): string {
    return `alert alert-${alert.type} ${alert.dismissible ? 'alert-dismissible' : ''} fade show`;
  }

  getIconClass(alert: Alert): string {
    switch (alert.type) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'danger':
        return 'bi bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi bi-exclamation-circle-fill';
      case 'info':
        return 'bi bi-info-circle-fill';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}