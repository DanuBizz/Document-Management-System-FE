import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

describe('CreateCategoryDialogComponent', () => {
  let component: CreateCategoryDialogComponent;
  let fixture: ComponentFixture<CreateCategoryDialogComponent>;
  let matDialogRefStub: Partial<MatDialogRef<CreateCategoryDialogComponent>>;
  let store: MockStore;
  const initialState = {
    categories: {
      isLoading: false,
      error: null,
      data: [
        {
          id: 1,
          name: 'test',
          userIds: [1, 2, 3],
        },
      ],
      queryParams: false,
    },
    user: {
      isLoading: false,
      error: null,
      data: [
        {
          id: 1,
          name: 'test user',
        },
      ],
    },
  };

  beforeEach(async () => {
    matDialogRefStub = {
      close: jasmine.createSpy('close'),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCategoryDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        provideAnimationsAsync(),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('userIds')).toBeTruthy();
    expect(component.form.get('name')?.errors?.['required']).toBeTrue();
    expect(component.form.get('userIds')?.errors?.['required']).toBeTrue();
  });

  it('should close dialog when close method is called', () => {
    component.close();
    expect(matDialogRefStub.close).toHaveBeenCalled();
  });

  it('should close dialog with form value when save method is called', () => {
    const formValue = { name: 'Test Category', userIds: [1, 2] };
    component.form.patchValue(formValue);
    component.save();
    expect(matDialogRefStub.close).toHaveBeenCalledWith(formValue);
  });

  it('should enable the button when form is valid', () => {
    component.form.controls['name'].setValue('NameNotDuplicate');
    component.form.controls['userIds'].setValue([2, 4]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-save-button')).nativeElement;

    expect(button.disabled).toBeFalse();
  });

  it('should disable the save-button when name already exists', () => {
    component.form.controls['name'].setValue('TEST');
    expect(component.form.get('name')?.errors?.['duplicateName']).toBeTrue();
    component.form.controls['userIds'].setValue([2, 4]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-save-button')).nativeElement;

    expect(button.disabled).toBeTrue();
  });
});
