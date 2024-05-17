import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectFileData, selectFileIsLoading } from '../../store/file/file.reducers';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-create-document-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatButton, MatDialogTitle, MatDivider],
  templateUrl: './display-document-dialog.component.html',
  styleUrl: './display-document-dialog.component.scss',
})
export class DisplayDocumentDialogComponent {
  data$ = combineLatest({
    fileUrl: this.store.select(selectFileData),
    isLoading: this.store.select(selectFileIsLoading),
  });

  constructor(
    private dialogRef: MatDialogRef<DisplayDocumentDialogComponent>,
    private store: Store
  ) {}

  close() {
    this.dialogRef.close();
  }
}
