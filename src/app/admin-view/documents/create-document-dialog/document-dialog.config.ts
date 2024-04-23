import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateDocumentDialogComponent } from './create-document-dialog.component';
import { DocumentResponseInterface } from '../../type/document-response.interface';

export function openCreateDocumentDialog(dialog: MatDialog, document: DocumentResponseInterface | null) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.width = '500px';

  config.data = document;

  const dialogRef = dialog.open(CreateDocumentDialogComponent, config);

  return dialogRef.afterClosed();
}
