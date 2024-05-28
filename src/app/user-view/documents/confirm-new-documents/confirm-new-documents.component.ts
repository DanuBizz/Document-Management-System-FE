import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, first } from 'rxjs';
import {
  selectDocumentAreLoaded,
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentTotalElements,
} from '../../../admin-view/documents/store/document.reducers';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';
import { DocumentVersionsResponseInterface } from '../../../admin-view/type/document-versions-response.interface';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { documentActions } from '../../../admin-view/documents/store/document.actions';
import { fileActions } from '../../../shared/store/file/file.actions';
import { selectFileData } from '../../../shared/store/file/file.reducers';
import { openDisplayDocumentDialog } from '../../../shared/component/display-document-dialog/display-document-dialog.config';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { MatDivider } from '@angular/material/divider';
import { MatBadge } from '@angular/material/badge';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Router } from '@angular/router';
import { selectCurrentUser } from '../../../auth/store/auth.reducers';
import { CurrentUserInterface } from '../../../shared/type/current-user.interface';

@Component({
  selector: 'app-confirm-new-documents',
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
    MatCheckbox,
    FabButtonComponent,
    MatProgressBar,
    MatDivider,
    MatBadge,
    ReactiveFormsModule,
    MatSelectionList,
    MatListOption,
    FormsModule,
  ],
  templateUrl: './confirm-new-documents.component.html',
  styleUrl: './confirm-new-documents.component.scss',
})
export class ConfirmNewDocumentsComponent implements OnInit {
  title = 'Dokumente zum Bestätigen';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    documents: this.store.select(selectDocumentData),
    isLoading: this.store.select(selectDocumentIsLoading),
    error: this.store.select(selectDocumentError),
    totalElements: this.store.select(selectDocumentTotalElements),
    areLoaded: this.store.select(selectDocumentAreLoaded),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  selectedDocuments: DocumentVersionsResponseInterface[] = [];

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog
   * @param router
   */
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(documentActions.getUnreadUserDocuments());

    this.data$.subscribe(data => {
      if (data.areLoaded && data.totalElements === '0') {
        this.router.navigateByUrl('user/documents-overview');
      }
    });
  }

  /**
   * Subscribes to the file data selector and opens the display document dialog
   * once the file data is available.
   */
  openDocumentInBrowser(id: number) {
    this.store.dispatch(fileActions.getFile({ id }));

    this.openDialogSubscription();
  }

  /**
   * Subscribes to the file data selector and opens the display document dialog
   * once the file data is available.
   */
  openDialogSubscription() {
    this.store
      .select(selectFileData)
      .pipe(first(fileUrl => fileUrl !== null))
      .subscribe(() => {
        openDisplayDocumentDialog(this.dialog);
      });
  }

  redirectToDocumentOverview() {
    this.store
      .select(selectCurrentUser)
      .pipe()
      .subscribe((user: CurrentUserInterface | null | undefined) => {
        if (user) {
          this.selectedDocuments.forEach(document => {
            const documentId = document.id;
            const userId = user.id;
            this.store.dispatch(documentActions.confirmDocument({ id: userId, docId: documentId }));
          });
        }
        this.store.dispatch(documentActions.getUnreadUserDocuments());
      });
  }
}
