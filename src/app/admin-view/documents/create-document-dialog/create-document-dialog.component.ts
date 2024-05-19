import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { first, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectCategoryAllData } from '../../categories/store/category.reducers';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { DocCategoryResponseInterface } from '../../../shared/type/doc-category-response.interface';
import { docCategoryActions } from '../../../shared/store/doc-category/doc-category.actions';
import { selectDocCategoryData } from '../../../shared/store/doc-category/doc-category.reducers';
import { DocumentRequestInterface } from '../../type/document-request.interface';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';

@Component({
  selector: 'app-create-document-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatDialogActions,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel,
    MatSuffix,
    FabButtonComponent,
  ],
  templateUrl: './create-document-dialog.component.html',
  styleUrl: './create-document-dialog.component.scss',
})
export class CreateDocumentDialogComponent implements OnInit {
  dialogTitle = 'Neues Dokument erstellen';

  // Form field name for the dialog, if document already exists
  formName: string = '';

  // Flag to disable form field name as true if document is passed and not null
  isDisabled: boolean = false;

  // Form group for the dialog
  form!: FormGroup;

  // Observable for retrieving categories from the store
  categories$: Observable<CategoryResponseInterface[]> = this.store.select(selectCategoryAllData);

  // List of current document categories to validate against duplicate names
  documentCategories: DocCategoryResponseInterface[] = [];

  // maximum file size in MB
  maxMB = 2;

  // allowed file types
  allowedTypes = ['pdf'];

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
      this.formName = this.document.documentName;
      this.dialogTitle = 'Neue Version erstellen';
    }
    // Initialize the form
    this.initializeForm();

    this.store.dispatch(docCategoryActions.getAllDocumentCategories());

    this.store
      .select(selectDocCategoryData)
      .pipe(first())
      .subscribe(docCategories => {
        this.documentCategories = docCategories;
      });
  }

  /**
   * Initializes the form with form controls and validators.
   * if data is passed, the formName is set to the document name and the name field is disabled.
   * Otherwise, the form name is required and must be unique.
   */
  initializeForm() {
    this.form = this.fb.group({
      name: [
        { value: this.formName, disabled: this.isDisabled },
        this.isDisabled ? [] : [Validators.required, this.validateDocumentCategoryName.bind(this)],
      ],
      fileName: ['', Validators.required],
      file: [
        null,
        [Validators.required, this.fileTypeValidator(this.allowedTypes), this.fileSizeValidator(this.maxMB)],
      ],
      categoryIds: ['', Validators.required],
    });
  }

  /**
   * Validates the name of a document category to ensure it is not a duplicate.
   * @param control The form control containing the name of the document category.
   * @returns An object with a 'duplicateName' key set to true if the name is a duplicate, or null if the name is unique.
   */
  validateDocumentCategoryName(control: FormControl): { [key: string]: boolean } | null {
    const existingDocCategory = this.documentCategories.find(
      docCategory => docCategory.name.toLowerCase() === control.value.toLowerCase()
    );
    return existingDocCategory ? { duplicateName: true } : null;
  }

  /**
   * Validates the file type of an uploaded file against a list of allowed types.
   * @param allowedTypes An array of allowed file types as strings.
   * @returns A validator function that checks if the file type is valid.
   */
  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const file = control.value;
      if (!file) {
        return null;
      }
      const fileType = file.name.split('.').pop().toLowerCase();
      if (allowedTypes.indexOf(fileType) === -1) {
        return { invalidFileType: true };
      }
      return null;
    };
  }

  /**
   * Validates the size of an uploaded file to ensure it does not exceed a specified maximum size.
   * @param maxSize The maximum allowed size of the file in megabytes.
   * @returns A validator function that checks if the file size is within the specified limit.
   */
  fileSizeValidator(maxSize: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const file = control.value;
      if (!file) {
        return null;
      }
      if (file.size > maxSize * 1024 * 1024) {
        return { sizeExceeded: true };
      }
      return null;
    };
  }

  /**
   * Closes the dialog.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Saves the form data and closes the dialog.
   * If a document exists, combines the form data with the document name and closes the dialog.
   * Otherwise, it closes the dialog with the form data
   */
  save() {
    const date = new Date();

    // If a document exists, close the dialog with the form value
    if (this.document !== null) {
      const newVersion: DocumentRequestInterface = {
        file: this.form.value.file,
        categoryIds: this.form.value.categoryIds,
        name: this.formName,
        timestamp: date,
      };

      this.dialogRef.close(newVersion);
    } else {
      // Otherwise, combine the form data with the document name and close the dialog
      const newDocument: DocumentRequestInterface = {
        file: this.form.value.file,
        categoryIds: this.form.value.categoryIds,
        name: this.form.value.name,
        timestamp: date,
      };
      this.dialogRef.close(newDocument);
    }
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
      const selectedFile = event.target.files[0];

      this.form.get('file')!.setValue(selectedFile);

      this.form.patchValue({
        fileName: selectedFile.name,
      });
    }
  }

  /**
   * Formats the size of a file from bytes to a human-readable string representation.
   * @param sizeInBytes The size of the file in bytes.
   * @returns A string representing the size of the file in megabytes with two decimal places and the unit "MB".
   */
  formatFileSize(sizeInBytes: number): string {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2) + ' MB';
  }

  /**
   * Formats an array of allowed file types into a comma-separated string.
   * @param allowedTypes An array of allowed file types as strings.
   * @returns A string containing the allowed file types separated by commas.
   */
  formatAllowedTypes(allowedTypes: string[]): string {
    return allowedTypes.join(', ');
  }
}
