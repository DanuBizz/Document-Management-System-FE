import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { Store } from '@ngrx/store';
import { documentActions } from '../../../admin-view/documents/store/document.actions';
import { combineLatest } from 'rxjs';
import {
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentPageSizeOptions,
  selectDocumentPagination,
  selectDocumentTotalElements,
} from '../../../admin-view/documents/store/document.reducers';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    pagination: this.store.select(selectDocumentPagination),
  });

  // Pagination and sorting properties for the component ts file
  pagination!: PaginationQueryParamsInterface;

  // Columns to display in the document table
  displayedColumns: string[] = ['documentName', 'timestamp'];

  /**
   * @param store - The Redux store instance injected via dependency injection.
   */
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.pagination = {
        pageNumber: data.pagination.pageNumber,
        pageSize: data.pagination.pageSize,
        sort: data.pagination.sort,
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
    this.pagination = {
      ...this.pagination,
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

    this.pagination = {
      ...this.pagination,
      sort: sort,
    };

    this.dispatchGetDocumentsWithQueryAction();
  }

  /**
   * Dispatches an action to fetch documents data based on the current pagination and sorting options.
   */
  private dispatchGetDocumentsWithQueryAction() {
    this.store.dispatch(documentActions.getDocumentsWithQuery({ pagination: this.pagination }));
  }
}
