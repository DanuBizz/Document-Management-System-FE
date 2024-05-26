import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { selectCategoryAllData } from '../store/category.reducers';
import { categoryActions } from '../store/category.actions';
import { CategoryRequestInterface } from '../../type/category-request.interface';
import { selectGroupAllData } from '../../users/store/group/group.reducers';
import { GroupResponseInterface } from '../../type/group-response-interface';
import { groupActions } from '../../users/store/group/group.actions';

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
  dialogTitle = 'Neue Kategorie erstellen';

  // Form field name and categoryIds for the dialog, if category already exists
  formName: string = '';
  formCategoryGroupIds: number[] = [];

  // Flag to disable form field name as true if document is passed and not null
  isDisabled: boolean = false;

  // Form group for the dialog
  form!: FormGroup;

  // Observable for retrieving users from the store
  groups$: Observable<GroupResponseInterface[]> = this.store.select(selectGroupAllData);

  // List of current categories to validate against duplicate names
  categories: CategoryResponseInterface[] = [];

  /**
   * @param fb - The FormBuilder service for creating form controls and groups.
   * @param category The category data to pass to the dialog.
   * @param dialogRef - The MatDialogRef service for managing dialog reference.
   * @param store - The Redux store instance injected via dependency injection.
   */
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private category: CategoryResponseInterface | null,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    private store: Store
  ) {
    // If category data exists, set formName and disable form fields
    if (this.category !== null) {
      this.formName = this.category.name;
      this.formCategoryGroupIds = this.category.groupIds;
      this.isDisabled = true;
      this.dialogTitle = 'Kategorie bearbeiten';
    }

    this.initializeForm();

    // dispatch actions to get all users and categories
    this.store.dispatch(categoryActions.getAllCategories());
    this.store.dispatch(groupActions.getAllGroups());

    this.store
      .select(selectCategoryAllData)
      .pipe()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  /**
   * Initialize form with form controls and validators
   * The form name is required and must be unique.
   */
  initializeForm() {
    this.form = this.fb.group({
      name: [
        { value: this.formName, disabled: this.isDisabled },
        this.isDisabled ? [] : [Validators.required, this.validateCategoryName.bind(this)],
      ],
      groupIds: [this.formCategoryGroupIds, Validators.required],
    });
  }

  /**
   * Checks if the entered category name already exists.
   *
   * @param control The FormControl object containing the value to be checked.
   * @return An object that is `null` if the category name is unique, or an object with the key 'duplicateName' and the value 'true' if the category name already exists.
   */
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
   * If a category exists, it returns the new user ids.
   * Otherwise, saves the form data and closes the dialog.
   */
  save() {
    if (this.category !== null) {
      const newUserIds: number[] = this.form.value.userIds;
      this.dialogRef.close(newUserIds);
    } else {
      const newCategory: CategoryRequestInterface = {
        ...this.form.value,
      };
      this.dialogRef.close(newCategory);
    }
  }
}
