import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
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
import {
  selectCategoryData,
  selectCategoryError,
  selectCategoryIsLoading,
  selectCategoryPageSizeOptions,
  selectCategoryPagination,
  selectCategoryTotalElements,
} from '../store/category.reducers';
import { MatProgressBar } from '@angular/material/progress-bar';
import { openCreateCategoryDialog } from '../create-category-dialog/category-dialog.config';
import { MatDialog } from '@angular/material/dialog';
import { categoryActions } from '../store/category.actions';
import { CategoryRequestInterface } from '../../type/category-request.interface';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';

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
    isLoading: this.store.select(selectCategoryIsLoading),
    error: this.store.select(selectCategoryError),
    totalElements: this.store.select(selectCategoryTotalElements),
    pageSizeOptions: this.store.select(selectCategoryPageSizeOptions),
    pagination: this.store.select(selectCategoryPagination),
  });

  // Pagination and sorting properties for the component ts file
  pagination!: PaginationQueryParamsInterface;

  // Columns to display in the table
  displayedColumns: string[] = ['id', 'name', 'users'];

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

    this.dispatchGetCategoriesWithQueryAction();
  }

  /**
   * Opens a dialog to create a new category.
   * This method is prepared but not fully implemented.
   */
  createNewCategory() {
    openCreateCategoryDialog(this.dialog)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        const newCategory: CategoryRequestInterface = {
          ...val,
        };
        this.store.dispatch(categoryActions.createCategory({ category: newCategory }));
      });
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve categories with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.pagination = {
      ...this.pagination,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    this.dispatchGetCategoriesWithQueryAction();
  }

  /**
   * Dispatches an action to fetch categories data based on the current pagination and sorting options.
   */
  private dispatchGetCategoriesWithQueryAction() {
    this.store.dispatch(categoryActions.getCategoriesWithQuery({ pagination: this.pagination }));
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

    this.dispatchGetCategoriesWithQueryAction();
  }
}
