import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectCategoryData } from '../../categories/store/category.reducers';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { CategoryResponseInterface } from '../../type/category-response.interface';

@Component({
  selector: 'app-create-document-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatSelect,
    MatOption,
    MatDialogActions,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel,
  ],
  templateUrl: './create-document-dialog.component.html',
  styleUrl: './create-document-dialog.component.scss',
})
export class CreateDocumentDialogComponent implements OnInit {
  dialogTitle = 'Neues Dokument erstellen';
  formName: string = '';

  // Flag to disable form field name as true if document is passed and not null
  isDisabled: boolean = false;

  // Form group for the dialog
  form!: FormGroup;

  // Observable for retrieving categories from the store
  categories$: Observable<CategoryResponseInterface[]> = this.store.select(selectCategoryData);

  /**
   * @param fb - The FormBuilder service for creating form controls and groups.
   * @param document - The document data to pass to the dialog.
   * @param dialogRef - The MatDialogRef service for managing dialog reference.
   * @param store - The Redux store instance injected via dependency injection.
   */
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private document: DocumentResponseInterface | null,
    private dialogRef: MatDialogRef<CreateDocumentDialogComponent>,
    private store: Store
  ) {}

  ngOnInit(): void {
    // If document data exists, set formName and disable form fields
    if (this.document !== null) {
      this.isDisabled = true;
      this.formName = this.document.name;
      this.dialogTitle = 'Neue Version erstellen';
    }
    // Initialize the form
    this.initializeForm();
  }

  /**
   * Initializes the form with form controls and validators.
   */
  initializeForm() {
    this.form = this.fb.group({
      name: [{ value: this.formName, disabled: this.isDisabled }, this.isDisabled ? [] : Validators.required],
      version: ['', Validators.required],
      filePath: ['', Validators.required],
      categories: ['', Validators.required],
    });
  }

  /**
   * Closes the dialog.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Saves the form data and closes the dialog.
   * If a document exists, closes the dialog with the form value.
   * Otherwise, combines the form data with the document name and closes the dialog.
   */
  save() {
    // If a document exists, close the dialog with the form value
    if (this.document !== null) {
      this.dialogRef.close(this.form.value);
    }

    // Otherwise, combine the form data with the document name and close the dialog
    const newData = {
      name: this.formName,
      ...this.form.value,
    };

    this.dialogRef.close(newData);
  }
}
