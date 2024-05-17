import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayDocumentDialogComponent } from './display-document-dialog.component';

/**
 * Function to open the create document dialog.
 * @param dialog - The MatDialog service for opening dialogs.
 * @returns An observable that emits the result when the dialog is closed.
 */
export function openDisplayDocumentDialog(dialog: MatDialog) {
  const config = new MatDialogConfig();

  config.disableClose = true; // Prevent closing the dialog by clicking outside or pressing Escape key
  config.autoFocus = true; // Focus on the first focusable element in the dialog
  config.panelClass = 'modal-panel'; // Custom CSS class for styling the dialog panel
  config.width = '1500px';
  config.height = '95%';

  // Open the dialog with the specified component and configuration
  const dialogRef = dialog.open(DisplayDocumentDialogComponent, config);

  // Return an observable that emits the result when the dialog is closed
  return dialogRef.afterClosed();
}
