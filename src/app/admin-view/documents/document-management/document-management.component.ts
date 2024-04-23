import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter } from 'rxjs';
import { DocumentService } from '../../../shared/service/document.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { Store } from '@ngrx/store';
import { selectDocumentData, selectError, selectIsLoading } from '../store/document.reducers';
import { documentActions } from '../store/document.actions';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { openCreateDocumentDialog } from '../create-document-dialog/document-dialog.config';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginator,
    MatProgressSpinner,
    MatCheckbox,
    FabButtonComponent,
    MatProgressBar,
  ],
  providers: [DocumentService],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss',
})
export class DocumentManagementComponent implements OnInit {
  title = 'Dokument Management';

  data$ = combineLatest({
    document: this.store.select(selectDocumentData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
  });

  expandedDocument: DocumentResponseInterface | null = null;

  displayedColumns: string[] = ['select', 'id', 'name', 'categories'];

  selection = new SelectionModel<DocumentResponseInterface>(false, []);

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.dispatch(documentActions.getDocuments());
  }

  onDocumentToggled(document: DocumentResponseInterface) {
    this.selection.toggle(document);
  }

  onToggleDocument(document: DocumentResponseInterface) {
    if (document == this.expandedDocument) {
      this.expandedDocument = null;
    } else {
      this.expandedDocument = document;
    }
  }

  createNewDocument() {
    openCreateDocumentDialog(this.dialog, null)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        console.log('new course value: ', val);
      });
  }

  createNewVersion() {
    this.data$.pipe(filter(data => !data.isLoading && !data.error)).subscribe(data => {
      const selectedDocument = data.document.find(document => this.selection.selected.at(0)!.id === document.id);

      if (selectedDocument) {
        openCreateDocumentDialog(this.dialog, selectedDocument)
          .pipe(filter(val => !!val))
          .subscribe(val => console.log('new course value: ', val));
      } else {
        console.error('Document not found.');
      }
    });
  }
}
