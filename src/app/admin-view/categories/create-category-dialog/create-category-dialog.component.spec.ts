import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('CreateCategoryDialogComponent', () => {
  let component: CreateCategoryDialogComponent;
  let fixture: ComponentFixture<CreateCategoryDialogComponent>;
  let matDialogRefStub: Partial<MatDialogRef<CreateCategoryDialogComponent>>;

  beforeEach(async () => {
    matDialogRefStub = {
      close: jasmine.createSpy('close'),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCategoryDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: matDialogRefStub }, provideAnimationsAsync()],
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

  it('should initialize form with required fields', () => {
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('user')).toBeTruthy();
    expect(component.form.get('name')?.errors?.['required']).toBeTrue();
    expect(component.form.get('user')?.errors?.['required']).toBeTrue();
  });

  it('should close dialog when close method is called', () => {
    component.close();
    expect(matDialogRefStub.close).toHaveBeenCalled();
  });

  it('should close dialog with form value when save method is called', () => {
    const formValue = { name: 'Test Category', user: ['User1', 'User2'] };
    component.form.patchValue(formValue);
    component.save();
    expect(matDialogRefStub.close).toHaveBeenCalledWith(formValue);
  });
});
