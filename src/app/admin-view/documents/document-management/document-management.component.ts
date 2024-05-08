import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter } from 'rxjs';
import { DocumentService } from '../../../shared/service/document.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { Store } from '@ngrx/store';
import {
  selectDocumentData,
  selectDocumentError,
  selectDocumentIsLoading,
  selectDocumentPageSizeOptions,
  selectDocumentPagination,
  selectDocumentTotalElements,
} from '../store/document.reducers';
import { documentActions } from '../store/document.actions';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { openCreateDocumentDialog } from '../create-document-dialog/document-dialog.config';
import { categoryActions } from '../../categories/store/category.actions';

import { DocumentResponseInterface } from '../../type/document-response.interface';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';

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
  });

  // Pagination and sorting properties for the component ts file
  pagination!: PaginationQueryParamsInterface;

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

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog - The MatDialog service for opening dialogs.
   */
  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.pagination = {
        pageNumber: data.pagination.pageNumber,
        pageSize: data.pagination.pageSize,
        sort: data.pagination.sort,
      };
    });

    this.dispatchGetDocumentsWithQueryAction();

    // Load all categories on initialization
    this.store.dispatch(categoryActions.getAllCategories());
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
   * @param userNames An array of category names to be sorted and joined.
   * @return A string containing the sorted category names joined by commas.
   */
  sortAndJoinCategoryNames(categoryNames: string[]): string {
    const sortedCategoryNames = categoryNames.slice().sort();
    return sortedCategoryNames.join(', ');
  }
}
