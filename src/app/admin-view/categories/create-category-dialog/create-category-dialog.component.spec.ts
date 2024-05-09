import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { provideMockStore } from '@ngrx/store/testing';

describe('CreateCategoryDialogComponentNew', () => {
  let component: CreateCategoryDialogComponent;
  let fixture: ComponentFixture<CreateCategoryDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateCategoryDialogComponent>>;
  let storeSpy: jasmine.SpyObj<Store>;

  const initialState = {
    categories: {
      isLoading: false,
      error: null,
      allData: [
        {
          id: 1,
          name: 'test',
          userNames: ['user1', 'user2', 'user3'],
        },
      ],
      tableData: [
        {
          id: 1,
          name: 'test',
          userNames: ['user1', 'user2', 'user3'],
        },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        total: 1,
      },
    },
    user: {
      isLoading: false,
      error: null,
      data: [
        {
          id: 1,
          name: 'user1',
        },
      ],
    },
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of([{ name: 'test' }]));

    await TestBed.configureTestingModule({
      imports: [CreateCategoryDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
        provideAnimationsAsync(),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form with default title when category is null', () => {
    expect(component.dialogTitle).toEqual('Neue Kategorie erstellen');
  });

  xit('should close dialog and return form value on save button click', fakeAsync(() => {
    const formValue = { name: 'test', userIds: [1, 2] };
    component.form.setValue(formValue);
    component.save();
    tick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining(formValue));
  }));

  it('should disable the save-button when name already exists', () => {
    component.form.controls['name'].setValue('TEST');
    expect(component.form.get('name')?.errors?.['duplicateName']).toBeTrue();
    component.form.controls['userIds'].setValue([2, 4]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-save-button')).nativeElement;

    expect(button.disabled).toBeTrue();
  });
});

describe('CreateCategoryDialogComponentEdit', () => {
  let component: CreateCategoryDialogComponent;
  let fixture: ComponentFixture<CreateCategoryDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateCategoryDialogComponent>>;
  let storeSpy: jasmine.SpyObj<Store>;
  const categoryMock: CategoryResponseInterface = {
    id: 1,
    name: 'test',
    userNames: ['user1', 'user2', 'user3'],
    userIds: [1, 2, 3],
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of('test'));

    await TestBed.configureTestingModule({
      imports: [CreateCategoryDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: categoryMock },
        { provide: Store, useValue: storeSpy },
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct dialog title', () => {
    expect(component.dialogTitle).toEqual('Kategorie bearbeiten');
  });

  it('should initialize form when category is present', () => {
    expect(component.form.controls['name'].value).toEqual('test');
  });

  it('should close dialog when close method is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close dialog with userIds when save method is called', () => {
    // Arrange
    const formValue = { userIds: [1, 2] };
    component.form.get('userIds')?.setValue(formValue.userIds);

    // Act
    component.save();

    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalledWith(formValue.userIds);
  });

  it('should enable the button when form is valid', () => {
    component.form.controls['name'].setValue('NameNotDuplicate');
    component.form.controls['userIds'].setValue([2, 4]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-save-button')).nativeElement;

    expect(button.disabled).toBeFalse();
  });
});
