import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { openCreateCategoryDialog } from './category-dialog.config';
import { CategoryResponseInterface } from '../../type/category-response.interface';

describe('openCreateCategoryDialog', () => {
  let dialog: MatDialog;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialog }],
    });
  });

  it('should open create category dialog with correct config', () => {
    const category: CategoryResponseInterface = {
      id: 1,
      name: 'Category 1',
      userNames: ['user1'],
      userIds: [1],
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}) });
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'modal-panel';
    config.width = '900px';
    config.data = category;
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);

    openCreateCategoryDialog(dialog, category);

    expect(dialog.open).toHaveBeenCalledWith(CreateCategoryDialogComponent, jasmine.objectContaining(config));
  });

  it('should return dialog afterClosed observable', () => {
    const category: CategoryResponseInterface | null = null;

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}) });
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);

    const result = openCreateCategoryDialog(dialog, category);

    expect(result).toBe(dialogRefSpyObj.afterClosed());
  });
});
