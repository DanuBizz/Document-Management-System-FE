import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { combineLatest, first } from 'rxjs';
import {
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentPageSizeOptions,
  selectDocumentQueryParams,
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { MatDivider } from '@angular/material/divider';
import { MatBadge } from '@angular/material/badge';
import { MatListOption, MatSelectionList } from '@angular/material/list';

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
    pageSizeOptions: this.store.select(selectDocumentPageSizeOptions),
    queryParams: this.store.select(selectDocumentQueryParams),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  // Columns to display in the document table
  displayedColumns: string[] = ['documentName', 'select'];

  // Selection model for documents. Represents the current selected column document
  selection = new SelectionModel<DocumentVersionsResponseInterface>(true, []);

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog
   */
  constructor(
    private store: Store,
    private dialog: MatDialog
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

    this.dispatchGetDocumentsWithQueryAction();
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

  /**
   * Toggles the selection of a document and updates the visibility icon accordingly.
   * @param document The document to toggle the selection for.
   */
  onToggleSelectDocument(document: DocumentVersionsResponseInterface) {
    this.selection.toggle(document);
    if (this.selection.selected.length > 0) {
      //this.changeVisibilityIcon(document.isVisible);
    } else {
      //this.visibilityIcon = this.visibilityIconList[2];
    }
  }
}
