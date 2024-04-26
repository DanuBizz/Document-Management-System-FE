import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateDocumentDialogComponent } from './create-document-dialog.component';
import { DocumentResponseInterface } from '../../type/document-response.interface';

/**
 * Function to open the create document dialog.
 * @param dialog - The MatDialog service for opening dialogs.
 * @param document - The document data to pass to the dialog.
 * @returns An observable that emits the result when the dialog is closed.
 */
export function openCreateDocumentDialog(dialog: MatDialog, document: DocumentResponseInterface | null) {
  const config = new MatDialogConfig();

  config.disableClose = true; // Prevent closing the dialog by clicking outside or pressing Escape key
  config.autoFocus = true; // Focus on the first focusable element in the dialog
  config.panelClass = 'modal-panel'; // Custom CSS class for styling the dialog panel
  config.width = '500px';

  config.data = document; // Pass document data to the dialog component

  // Open the dialog with the specified component and configuration
  const dialogRef = dialog.open(CreateDocumentDialogComponent, config);

  // Return an observable that emits the result when the dialog is closed
  return dialogRef.afterClosed();
}
