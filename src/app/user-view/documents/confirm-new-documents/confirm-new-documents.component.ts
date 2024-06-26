import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, first, Subject, takeUntil } from 'rxjs';
import {
  selectDocumentAreLoaded,
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentTotalElements,
} from '../../../shared/store/document/document.reducers';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';
import { DocumentVersionsResponseInterface } from '../../../admin-view/type/document-versions-response.interface';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { documentActions } from '../../../shared/store/document/document.actions';
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
export class ConfirmNewDocumentsComponent implements OnInit, OnDestroy {
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

  // Array to store the currently selected documents
  selectedDocuments: DocumentVersionsResponseInterface[] = [];

  // Array to track if a document has been clicked before it can be checked
  clickedDocuments: { [key: number]: boolean } = {};

  // A subject used to signal the destruction of the component and unsubscribe from active subscriptions.
  private unsubscribe$ = new Subject<void>();

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

  /**
   * Dispatches an action to fetch unread user documents from the store.
   * Subscribes to the data observable to handle the fetched data.
   * Redirects to 'user/documents-overview' route if there are no unread documents.
   * Initializes clickedDocuments object with document IDs set to false by default.
   */
  ngOnInit(): void {
    this.store.dispatch(documentActions.getUnreadUserDocuments());

    this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data.areLoaded && data.totalElements === '0') {
        this.router.navigateByUrl('user/documents-overview');
        this.unsubscribe$.next();
      }

      data.documents.forEach(document => {
        this.clickedDocuments[document.id] = false;
      });
    });
  }

  /**
   * Performs clean-up operations when the component is destroyed.
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
   * Opens the document in the browser based on the provided document ID.
   * event.stopPropagation avoids that the checkbox will be touched if clicks on the button.
   * Sets the clicked state of the document item to true in the clickedDocuments object.
   *
   * @param documentId - The ID of the document to be opened.
   * @param event - The click event object.
   */
  handleClick(documentId: number, event: Event): void {
    this.openDocumentInBrowser(documentId);
    event.stopPropagation();
    this.clickedDocuments[documentId] = true;
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

  /**
   * Redirects to the document overview page after confirming selected documents.
   * Retrieves the current user from the store.
   * If a user is found:
   *    - Iterates over selected documents.
   *    - Dispatches an action to confirm each document with the user's ID.
   * Dispatches an action to fetch unread user documents from the store.
   * In ngOnInit is a subscription to the data observable to handle the fetched data.
   */
  redirectToDocumentOverview() {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.unsubscribe$))
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
