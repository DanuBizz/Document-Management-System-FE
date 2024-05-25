import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter, first } from 'rxjs';
import { DocumentService } from '../../../shared/service/document.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { Store } from '@ngrx/store';
import {
  selectDocumentAreLoaded,
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentIsSubmitting,
  selectDocumentPageSizeOptions,
  selectDocumentPagination,
  selectDocumentTotalElements,
} from '../store/document.reducers';
import { documentActions } from '../store/document.actions';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { openCreateDocumentDialog } from '../create-document-dialog/document-dialog.config';

import { DocumentResponseInterface } from '../../type/document-response.interface';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { MatDivider } from '@angular/material/divider';
import { fileActions } from '../../../shared/store/file/file.actions';
import { openDisplayDocumentDialog } from '../../../shared/component/display-document-dialog/display-document-dialog.config';
import { selectFileData } from '../../../shared/store/file/file.reducers';
import { MatBadge } from '@angular/material/badge';
import { DispatchActionService } from '../../../shared/service/dispatch-action.service';

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
    MatCheckbox,
    FabButtonComponent,
    MatProgressBar,
    MatDivider,
    MatBadge,
  ],
  providers: [DocumentService],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss',
})
export class DocumentManagementComponent implements OnInit {
  title = 'Dokument Management';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    documents: this.store.select(selectDocumentData),
    isLoading: this.store.select(selectDocumentIsLoading),
    error: this.store.select(selectDocumentError),
    totalElements: this.store.select(selectDocumentTotalElements),
    pageSizeOptions: this.store.select(selectDocumentPageSizeOptions),
    pagination: this.store.select(selectDocumentPagination),
    isSubmitting: this.store.select(selectDocumentIsSubmitting),
    areLoaded: this.store.select(selectDocumentAreLoaded),
  });

  // Pagination and sorting properties for the component ts file
  pagination!: PaginationQueryParamsInterface;

  // Booleans indicating whether data is currently being fetched or submitted to the database
  isSubmitting: boolean = false;
  isLoading: boolean = false;

  // Currently expanded document
  expandedDocument: DocumentVersionsResponseInterface | null = null;

  // Columns to display in the document table
  displayedColumns: string[] = ['select', 'id', 'documentName', 'timestamp', 'categories'];

  // Selection model for documents. Represents the current selected column document
  selection = new SelectionModel<DocumentVersionsResponseInterface>(false, []);

  // List of visibility icons, depending on the current document state
  visibilityIconList = ['visibility_on', 'visibility_off', 'hide_source'];

  // List of visibility tooltips
  tooltipVisibilityButtonList = ['Dokument verbergen', 'Dokument anzeigen'];

  // icon for toggle visibility
  visibilityIcon = this.visibilityIconList[2];

  // tooltip for toggle visibility
  tooltipVisibilityButton = '';

  // Maximum number of users to display in the list
  maxVisibleCategories = 4;

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog - The MatDialog service for opening dialogs.
   * @param dispatchActionService - Dispatches an action only if needed, based on the current state of areLoaded
   */
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private dispatchActionService: DispatchActionService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.pagination = {
        pageNumber: data.pagination.pageNumber,
        pageSize: data.pagination.pageSize,
        sort: data.pagination.sort,
      };
      this.isLoading = data.isLoading;
      this.isSubmitting = data.isSubmitting;
    });

    // Using the DispatchActionService to check if the data are loaded.
    // If not loaded, it dispatches the action to get the data with a query.
    this.dispatchActionService.checkAndDispatchAction(this.store.select(selectDocumentAreLoaded), () =>
      this.dispatchGetDocumentsWithQueryAction()
    );
  }

  /**
   * Toggles the selection of a document and updates the visibility icon accordingly.
   * @param document The document to toggle the selection for.
   */
  onToggleSelectDocument(document: DocumentVersionsResponseInterface) {
    this.selection.toggle(document);
    if (this.selection.selected.length > 0) {
      this.changeVisibilityIcon(document.isVisible);
    } else {
      this.visibilityIcon = this.visibilityIconList[2];
    }
  }

  /**
   * Toggles the expansion of a document row.
   * @param document The document for which to toggle the row expansion.
   */
  onToggleExpandedDocumentRow(document: DocumentVersionsResponseInterface) {
    if (!document.oldVersions) {
      this.expandedDocument = null;
    } else {
      if (document.oldVersions?.length > 0) {
        if (document == this.expandedDocument) {
          this.expandedDocument = null;
          this.resetToggleIconAndSelection();
        } else {
          this.expandedDocument = document;
        }
      }
    }
  }

  createNewDocument() {
    this.passValueForCreateDocumentDialog(null);
  }

  createNewVersion() {
    const newDocument: DocumentResponseInterface = {
      ...this.selection.selected.at(0)!,
    };
    this.passValueForCreateDocumentDialog(newDocument);
  }

  /**
   * Opens a dialog to create a new document or a new version of an existing document.
   * Depending on if document is null or not.
   * After it resets the toggle icon and selection.
   */
  passValueForCreateDocumentDialog(document: DocumentResponseInterface | null) {
    openCreateDocumentDialog(this.dialog, document)
      .pipe(filter(val => !!val))
      .subscribe(document => {
        this.store.dispatch(documentActions.createDocumentVersion({ doc: document }));
      });

    this.resetToggleIconAndSelection();
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve documents with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.pagination = {
      ...this.pagination,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    this.dispatchGetDocumentsWithQueryAction();
  }

  /**
   * Constructs a new MatTableDataSource using the provided array of DocumentResponseInterface objects.
   * @param document An array of DocumentResponseInterface objects to be used as the data source.
   * @return A new MatTableDataSource instance initialized with the provided array.
   */
  getMatTableData(document: DocumentResponseInterface[]) {
    return new MatTableDataSource(document);
  }

  /**
   * Changes the visibility icon and tooltip based on the provided visibility status.
   * @param isVisible A boolean indicating the visibility status.
   */
  changeVisibilityIcon(isVisible: boolean) {
    this.visibilityIcon = isVisible ? this.visibilityIconList[0] : this.visibilityIconList[1];
    this.tooltipVisibilityButton = isVisible
      ? this.tooltipVisibilityButtonList[0]
      : this.tooltipVisibilityButtonList[1];
  }

  /**
   * Dispatches an action to change the visibility status of a document and resets the toggle icon and selection.
   */
  changeIsVisibleStatusForDocument() {
    this.store.dispatch(documentActions.changeDocumentVisibility({ id: this.selection.selected.at(0)!.id }));
    this.resetToggleIconAndSelection();
  }

  /**
   * Resets the toggle icon to its default state and clears the current selection.
   */
  private resetToggleIconAndSelection() {
    this.selection = new SelectionModel<DocumentVersionsResponseInterface>(false, []);
    this.visibilityIcon = this.visibilityIconList[2];
  }

  /**
   * Dispatches an action to fetch documents data based on the current pagination and sorting options.
   */
  private dispatchGetDocumentsWithQueryAction() {
    this.store.dispatch(documentActions.getDocumentsWithQuery({ pagination: this.pagination }));
  }

  /**
   * Changes the sorting order based on the specified sort state.
   *
   * @param sortState The current sort state.
   */
  changeSort(sortState: Sort) {
    let sort = '';
    if (sortState.direction !== '') {
      sort = sortState.active + ',' + sortState.direction;
    }

    this.pagination = {
      ...this.pagination,
      sort: sort,
    };

    this.dispatchGetDocumentsWithQueryAction();
  }

  /**
   * Sorts an array of category names alphabetically and joins them into a single string.
   *
   * @return A string containing the sorted category names joined by commas.
   * @param categoryNames
   * @param trunc truncate the list if too long
   * @param maxUsersVisible length to truncate if list is too long
   */
  sortAndJoinCategoryNames(categoryNames: string[], trunc: boolean, maxUsersVisible: number): string {
    const sortedNames = categoryNames.slice().sort().join(', ');
    if (trunc) {
      const truncatedSortedNames = categoryNames.slice().sort().slice(0, maxUsersVisible).join(', ');
      return truncatedSortedNames + '...';
    }
    return sortedNames;
  }

  checkIsLoadingIsSubmitting(): boolean {
    return this.isLoading || this.isSubmitting;
  }

  /**
   * Get the ID of the selected item
   * Dispatch an action to get the file with the given ID
   * Subscribe to open the dialog
   */
  openDocumentInBrowser() {
    const id = this.selection.selected.at(0)!.id;
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
}
