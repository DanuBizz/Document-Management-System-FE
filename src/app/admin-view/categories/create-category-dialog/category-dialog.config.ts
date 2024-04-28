import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';

/**
 * Function to open the create category dialog with a specific configuration.
 * @param dialog - The MatDialog service for opening dialogs.
 * @returns An observable that emits the result when the dialog is closed.
 */
export function openCreateCategoryDialog(dialog: MatDialog) {
  const config = new MatDialogConfig();

  config.disableClose = true; // Prevent closing the dialog by clicking outside or pressing Escape key
  config.autoFocus = true; // Focus on the first focusable element in the dialog
  config.panelClass = 'modal-panel'; // Custom CSS class for styling the dialog panel
  config.width = '900px';

  // Open the dialog with the specified component and configuration
  const dialogRef = dialog.open(CreateCategoryDialogComponent, config);

  // Return an observable that emits the result when the dialog is closed
  return dialogRef.afterClosed();
}
