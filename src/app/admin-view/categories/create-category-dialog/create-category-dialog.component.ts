import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { selectUserAllData } from '../../users/store/user.reducers';
import { Observable } from 'rxjs';
import { UserResponseInterface } from '../../type/user-response.interface';
import { userActions } from '../../users/store/user.actions';
import { CommonModule } from '@angular/common';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { selectCategoryAllData } from '../store/category.reducers';
import { categoryActions } from '../store/category.actions';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.scss',
})
export class CreateCategoryDialogComponent {
  // Form group for the dialog
  form: FormGroup;

  // Observable for retrieving users from the store
  users$: Observable<UserResponseInterface[]> = this.store.select(selectUserAllData);

  // List of current categories
  categories: CategoryResponseInterface[] = [];

  /**
   * @param fb - The FormBuilder service for creating form controls and groups.
   * @param dialogRef - The MatDialogRef service for managing dialog reference.
   * @param store - The Redux store instance injected via dependency injection.
   */
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    private store: Store
  ) {
    // Initialize form with form controls and validators
    // the form name is required and must be unique.
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateCategoryName.bind(this)]],
      userIds: ['', Validators.required],
    });

    this.store.dispatch(userActions.getAllUsers());
    this.store.dispatch(categoryActions.getAllCategories());

    this.store.select(selectCategoryAllData).subscribe(categories => {
      this.categories = categories;
    });
  }

  validateCategoryName(control: FormControl): { [key: string]: boolean } | null {
    const existingCategory = this.categories.find(
      category => category.name.toLowerCase() === control.value.toLowerCase()
    );
    return existingCategory ? { duplicateName: true } : null;
  }

  /**
   * Closes the dialog.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Saves and returns the form data and closes the dialog.
   */
  save() {
    this.dialogRef.close(this.form.value);
  }
}
