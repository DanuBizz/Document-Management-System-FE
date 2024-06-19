import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { CreateDocumentDialogComponent } from './create-document-dialog.component';
import { Store } from '@ngrx/store';
import { DocumentResponseInterface } from '../../../type/document-response.interface';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';

describe('CreateDocumentDialogComponentNewDocument', () => {
  let component: CreateDocumentDialogComponent;
  let fixture: ComponentFixture<CreateDocumentDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateDocumentDialogComponent>>;
  let storeSpy: jasmine.SpyObj<Store>;
  const documentMock: DocumentResponseInterface = {
    id: 1,
    documentName: 'Document 1',
    filePath: '/path/to/document1',
    timestamp: new Date(),
    categoryNames: ['Category 1'],
    isRead: true,
    isLatest: true,
    isVisible: true,
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of('Document 1'));

    await TestBed.configureTestingModule({
      imports: [CreateDocumentDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: documentMock },
        { provide: Store, useValue: storeSpy },
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct dialog title', () => {
    expect(component.dialogTitle).toEqual('Neue Version erstellen');
  });

  it('should initialize form when document is present', () => {
    expect(component.form.controls['name'].value).toEqual('Document 1');
  });

  it('should close dialog on close button click', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});

describe('CreateDocumentDialogComponentNewVersion', () => {
  let component: CreateDocumentDialogComponent;
  let fixture: ComponentFixture<CreateDocumentDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateDocumentDialogComponent>>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of([{ name: 'Document 1' }]));

    await TestBed.configureTestingModule({
      imports: [CreateDocumentDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: Store, useValue: storeSpy },
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form with default title when document is null', () => {
    expect(component.dialogTitle).toEqual('Neues Dokument erstellen');
  });

  xit('should close dialog and return form value on save button click', fakeAsync(() => {
    const formValue = { name: 'Test', fileName: 'test.pdf', categories: [1, 2] };
    component.form.setValue(formValue);
    component.save();
    tick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining(formValue));
  }));
});
