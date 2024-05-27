import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  messages: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) private data: Map<string, boolean>
  ) {
    this.messages = data;
  }

  removeMessage(messageKey: string) {
    this.messages.delete(messageKey);
    if (this.messages.size === 0) {
      this.snackBarRef.dismiss();
    }
  }
}
