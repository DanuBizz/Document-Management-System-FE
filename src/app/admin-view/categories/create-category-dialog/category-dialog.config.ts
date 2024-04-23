import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';

export function openCreateCategoryDialog(dialog: MatDialog) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.width = '500px';

  const dialogRef = dialog.open(CreateCategoryDialogComponent, config);

  return dialogRef.afterClosed();
}
