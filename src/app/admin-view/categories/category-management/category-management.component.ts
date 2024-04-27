import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../../shared/service/category.service';
import { combineLatest, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCategoryData, selectError, selectIsLoading, selectTotalElements } from '../store/category.reducers';
import { MatProgressBar } from '@angular/material/progress-bar';
import { openCreateCategoryDialog } from '../create-category-dialog/category-dialog.config';
import { MatDialog } from '@angular/material/dialog';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { categoryActions } from '../store/category.actions';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FabButtonComponent,
    MatTooltip,
    MatCheckbox,
    MatPaginator,
    MatProgressBar,
  ],
  providers: [CategoryService],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit {
  title = 'Kategorie Management';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    category: this.store.select(selectCategoryData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    totalElements: this.store.select(selectTotalElements),
  });

  // Columns to display in the table
  displayedColumns: string[] = ['id', 'name', 'users'];

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
    this.loadInitialCategoriesPage();
  }

  /**
   * Loads the initial categories page by constructing a pagination query interface
   * using the initial page index and page size from the pagination configuration service,
   * and dispatches an action to retrieve categories with query parameters.
   */
  private loadInitialCategoriesPage() {
    const request: PaginationQueryParamsInterface = {
      pageNumber: this.paginationConfigService.getInitialPageIndex(),
      pageSize: this.paginationConfigService.getPageSize(),
    };

    // Dispatch an action to retrieve categories with the updated pagination query
    this.store.dispatch(categoryActions.getCategoriesWithQuery({ queryParams: request }));
  }

  /**
   * Opens a dialog to create a new category.
   * This method is prepared but not fully implemented.
   */
  createNewCategory() {
    openCreateCategoryDialog(this.dialog)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        console.log('New category value:', val);
      });
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve categories with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.paginationConfigService.setPageSize(event.pageSize);

    const request: PaginationQueryParamsInterface = {
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    // Dispatch an action to retrieve categories with the updated pagination query
    this.store.dispatch(categoryActions.getCategoriesWithQuery({ queryParams: request }));
  }
}
