import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';
import { Store } from '@ngrx/store';
import { documentActions } from '../../../admin-view/documents/store/document.actions';
import { combineLatest, first } from 'rxjs';
import {
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentPageSizeOptions,
  selectDocumentQueryParams,
  selectDocumentTotalElements,
} from '../../../admin-view/documents/store/document.reducers';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fileActions } from '../../../shared/store/file/file.actions';
import { selectFileData } from '../../../shared/store/file/file.reducers';
import { openDisplayDocumentDialog } from '../../../shared/component/display-document-dialog/display-document-dialog.config';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DocumentVersionsResponseInterface } from '../../../admin-view/type/document-versions-response.interface';
import { DocumentResponseInterface } from '../../../admin-view/type/document-response.interface';
import { selectUserAreLoaded } from '../../../admin-view/users/store/user/user.reducers';
import { DispatchActionService } from '../../../shared/service/dispatch-action.service';

@Component({
  selector: 'app-documents-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginator,
    MatProgressBar,
    MatIcon,
  ],
  templateUrl: './documents-overview.component.html',
  styleUrl: './documents-overview.component.scss',
})
export class DocumentsOverviewComponent implements OnInit {
  title = 'Dokumenten Übersicht';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    documents: this.store.select(selectDocumentData),
    isLoading: this.store.select(selectDocumentIsLoading),
    error: this.store.select(selectDocumentError),
    totalElements: this.store.select(selectDocumentTotalElements),
    pageSizeOptions: this.store.select(selectDocumentPageSizeOptions),
    queryParams: this.store.select(selectDocumentQueryParams),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  // Columns to display in the document table
  displayedColumns: string[] = ['arrow', 'documentName', 'timestamp'];

  // Currently expanded document
  expandedDocument: DocumentVersionsResponseInterface | null = null;

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog
   * @param dispatchActionService
   */
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private dispatchActionService: DispatchActionService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.queryParams = {
        pageNumber: data.queryParams.pageNumber,
        pageSize: data.queryParams.pageSize,
        sort: data.queryParams.sort,
        search: data.queryParams.search,
      };
    });
    // Using the DispatchActionService to check if the data are loaded.
    // If not loaded, it dispatches the action to get the data with a query.
    this.dispatchActionService.checkAndDispatchAction(this.store.select(selectUserAreLoaded), () =>
      this.dispatchGetDocumentsWithQueryAction()
    );
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
        } else {
          this.expandedDocument = document;
        }
      }
    }
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
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve documents with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.queryParams = {
      ...this.queryParams,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    this.dispatchGetDocumentsWithQueryAction();
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

    this.queryParams = {
      ...this.queryParams,
      sort: sort,
    };

    this.dispatchGetDocumentsWithQueryAction();
  }

  /**
   * Dispatches an action to fetch documents data based on the current pagination and sorting options.
   */
  private dispatchGetDocumentsWithQueryAction() {
    this.store.dispatch(documentActions.getDocumentsWithQuery({ queryParams: this.queryParams }));
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
}
