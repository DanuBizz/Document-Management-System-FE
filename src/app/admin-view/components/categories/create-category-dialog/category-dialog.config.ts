import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { CategoryResponseInterface } from '../../../type/category-response.interface';

/**
 * Function to open the create category dialog with a specific configuration.
 * @param dialog - The MatDialog service for opening dialogs.
 * @param category can be either a existing category to be edited or null.
 * @returns An observable that emits the result when the dialog is closed.
 */
export function openCreateCategoryDialog(dialog: MatDialog, category: CategoryResponseInterface | null) {
  const config = new MatDialogConfig();

  config.disableClose = true; // Prevent closing the dialog by clicking outside or pressing Escape key
  config.autoFocus = true; // Focus on the first focusable element in the dialog
  config.panelClass = 'modal-panel'; // Custom CSS class for styling the dialog panel
  config.width = '900px';

  config.data = category;

  // Open the dialog with the specified component and configuration
  const dialogRef = dialog.open(CreateCategoryDialogComponent, config);

  // Return an observable that emits the result when the dialog is closed
  return dialogRef.afterClosed();
}
