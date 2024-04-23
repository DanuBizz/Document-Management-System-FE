import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';

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

  form: FormGroup;

  userList: string[] = ['User1', 'User2', 'User3', 'User4'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      user: ['', Validators.required],
    });

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
}
