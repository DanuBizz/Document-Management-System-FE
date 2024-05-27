import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { NotificationComponent } from '../component/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messages: Map<string, boolean> = new Map<string, boolean>();
  private snackBarRef!: MatSnackBarRef<NotificationComponent>;
  private snackBarIsDisplayed: boolean = false;
  private durationSuccess = 4000;
  private durationError = 10000;

  constructor(private snackBar: MatSnackBar) {}

  public pushNotification(message: string, isError: boolean): void {
    const duration = isError ? this.durationError : this.durationSuccess;
    this.messages.set(message, isError);

    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-snackbar'];
    config.data = this.messages;

    if (!this.snackBarIsDisplayed) {
      this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, config);

      this.snackBarIsDisplayed = true;
    }
    setTimeout(() => {
      this.snackBarRef.instance.removeMessage(message);
    }, duration);

    this.snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarIsDisplayed = false;
    });
  }
}
