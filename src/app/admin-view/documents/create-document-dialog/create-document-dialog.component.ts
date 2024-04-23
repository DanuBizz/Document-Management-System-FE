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
  formName: string = '';
  isDisabled: boolean = false;
  form!: FormGroup;
  dialogTitle = 'Neues Dokument erstellen';

  categories$: Observable<CategoryResponseInterface[]>;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private document: DocumentResponseInterface | null,
    private dialogRef: MatDialogRef<CreateDocumentDialogComponent>,
    private store: Store
  ) {
    this.categories$ = this.store.select(selectCategoryData);
  }

  ngOnInit(): void {
    if (this.document !== null) {
      this.isDisabled = true;
      this.formName = this.document.name;
      this.dialogTitle = 'Neue Version erstellen';
    }
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      name: [{ value: this.formName, disabled: this.isDisabled }, this.isDisabled ? [] : Validators.required],
      version: ['', Validators.required],
      filePath: ['', Validators.required],
      categories: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.document !== null) {
      this.dialogRef.close(this.form.value);
    }

    const newData = {
      name: this.formName,
      ...this.form.value,
    };

    this.dialogRef.close(newData);
  }
}
