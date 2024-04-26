import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
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

  // Temporary Array to simulate users
  userList: string[] = [];

  /**
   * @param fb - The FormBuilder service for creating form controls and groups.
   * @param dialogRef - The MatDialogRef service for managing dialog reference.
   */
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>
  ) {
    // Initialize form with form controls and validators
    this.form = this.fb.group({
      name: ['', Validators.required],
      user: ['', Validators.required],
    });

    // Populate userList array with dummy users
    for (let i = 1; i <= 50; i++) {
      this.userList.push(`User${i}`);
    }
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
