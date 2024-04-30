import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CreateDocumentDialogComponent } from './create-document-dialog.component';
import { openCreateDocumentDialog } from './document-dialog.config';
import { DocumentResponseInterface } from '../../type/document-response.interface';

describe('openCreateDocumentDialog', () => {
  let dialog: MatDialog;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialog }],
    });
  });

  it('should open create document dialog with correct config', () => {
    const document: DocumentResponseInterface = {
      id: 1,
      documentName: 'Document 1',
      filePath: '/path/to/document1',
      timestamp: new Date(),
      categoryNames: ['Category 1'],
      isRead: true,
      isLatest: true,
      isVisible: true,
    };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}) });
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'modal-panel';
    config.width = '900px';
    config.data = document;
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);

    openCreateDocumentDialog(dialog, document);

    expect(dialog.open).toHaveBeenCalledWith(CreateDocumentDialogComponent, jasmine.objectContaining(config));
  });

  it('should return dialog afterClosed observable', () => {
    const document: DocumentResponseInterface | null = null;
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}) });
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);

    const result = openCreateDocumentDialog(dialog, document);

    expect(result).toBe(dialogRefSpyObj.afterClosed());
  });
});
