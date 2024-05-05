import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter } from 'rxjs';
import { DocumentService } from '../../../shared/service/document.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { Store } from '@ngrx/store';
import { selectDocumentData, selectError, selectIsLoading, selectTotalElements } from '../store/document.reducers';
import { documentActions } from '../store/document.actions';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { openCreateDocumentDialog } from '../create-document-dialog/document-dialog.config';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';
import { categoryActions } from '../../categories/store/category.actions';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';

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

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    documents: this.store.select(selectDocumentData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    totalElements: this.store.select(selectTotalElements),
  });

  // Currently expanded document
  expandedDocument: DocumentVersionsResponseInterface | null = null;

  // Columns to display in the document table
  displayedColumns: string[] = ['select', 'id', 'name', 'version', 'categories'];

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
   * @param paginationConfigService contains the configuration values for the pagination
   */
  constructor(
    private store: Store,
    private dialog: MatDialog,
    public paginationConfigService: PaginationConfigService
  ) {}

  ngOnInit(): void {
    this.loadInitialDocumentsPage();

    // Load all categories on initialization
    this.store.dispatch(categoryActions.getAllCategories());
  }

  /**
   * Loads the initial documents page by constructing a pagination query interface
   * using the initial page index and page size from the pagination configuration service,
   * and dispatches an action to retrieve documents with query parameters.
   */
  private loadInitialDocumentsPage() {
    const request: PaginationQueryParamsInterface = {
      pageNumber: this.paginationConfigService.getInitialPageIndex(),
      pageSize: this.paginationConfigService.getPageSize(),
    };

    // Dispatch an action to retrieve documents with the updated pagination query
    this.store.dispatch(documentActions.getDocumentsWithQuery({ queryParams: request }));
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

  /**
   * Opens a dialog to create a new document.
   * This method is prepared but not fully implemented.
   *
   */
  createNewDocument() {
    openCreateDocumentDialog(this.dialog, null)
      .pipe(filter(val => !!val))
      .subscribe(document => {
        this.store.dispatch(documentActions.createDocumentVersion({ doc: document }));
      });

    this.resetToggleIconAndSelection();
  }

  /**
   * Opens a dialog to create a new version of a document.
   * This method is prepared but not fully implemented.
   */
  createNewVersion() {
    const newDocument: DocumentResponseInterface = {
      ...this.selection.selected.at(0)!,
    };
    // Open dialog to create new version with the selected document
    openCreateDocumentDialog(this.dialog, newDocument)
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
    this.paginationConfigService.setPageSize(event.pageSize);

    const request: PaginationQueryParamsInterface = {
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    // Dispatch an action to retrieve documents with the updated pagination query
    this.store.dispatch(documentActions.getDocumentsWithQuery({ queryParams: request }));
    this.resetToggleIconAndSelection();
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
}
