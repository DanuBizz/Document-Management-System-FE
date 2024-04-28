import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CommonModule} from '@angular/common';
import {selectCategoryData} from '../../categories/store/category.reducers';
import {DocumentResponseInterface} from '../../type/document-response.interface';
import {CategoryResponseInterface} from '../../type/category-response.interface';
import {MatIcon} from "@angular/material/icon";

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
    MatSuffix,
    MatIcon,
    MatMiniFabButton
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

  // contains the selected file object
  private file!: File;

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
      fileName: ['', Validators.required],
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

    let data = {
      ...this.form.value,
      file: this.file
    };

    // If a document exists, close the dialog with the form value
    if (this.document !== null) {
      this.dialogRef.close(data);
    }

    // Otherwise, combine the form data with the document name and close the dialog
    data = {
      name: this.formName,
      ...this.form.value,
      file: this.file
    };

    this.dialogRef.close(data);
  }

  /**
   * Handles the selection of a file from the file input.
   * Updates the form control and displays the selected file name.
   *
   * @param event The event object triggered by selecting a file.
   */
  selectFile(event: Event): void {
    // Check if the event target is an HTMLInputElement and if files are selected
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      // Get the first selected file
      this.file = event.target.files[0];
      // Patch the form value with the selected file name
      this.form.patchValue({
        fileName: this.file.name
      });
    }
  }



}
