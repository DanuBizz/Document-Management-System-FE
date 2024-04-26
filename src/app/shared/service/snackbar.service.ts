import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Opens a snackbar with the provided message.
   * @param message The message to display in the snackbar.
   */
  openSnackBar(message: string): void {
    const config = new MatSnackBarConfig();
    // Customize snackbar configuration
    config.duration = 7000;
    config.horizontalPosition = 'left';
    config.verticalPosition = 'top';
    config.panelClass = ['custom-snackbar']; // Apply custom styling to snackbar

    // Open snackbar with provided message and configuration
    this.snackBar.open(message, 'close', config);
  }
}
