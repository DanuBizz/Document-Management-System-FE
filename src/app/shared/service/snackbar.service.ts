import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 7000;
    config.horizontalPosition = 'left';
    config.verticalPosition = 'top';
    config.panelClass = ['custom-snackbar'];

    this.snackBar.open(message, 'close', config);
  }
}
