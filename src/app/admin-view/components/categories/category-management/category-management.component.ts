import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FabButtonComponent } from '../../../../shared/component/fab-button/fab-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../../../shared/service/category.service';
import { combineLatest, debounceTime, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCategoryAreLoaded,
  selectCategoryError,
  selectCategoryIsLoading,
  selectCategoryIsSubmitting,
  selectCategoryPageSizeOptions,
  selectCategoryQueryParams,
  selectCategoryTableData,
  selectCategoryTotalElements,
} from '../../../store/category/category.reducers';
import { MatProgressBar } from '@angular/material/progress-bar';
import { openCreateCategoryDialog } from '../create-category-dialog/category-dialog.config';
import { MatDialog } from '@angular/material/dialog';
import { categoryActions } from '../../../store/category/category.actions';
import { CategoryRequestInterface } from '../../../type/category-request.interface';
import { QueryParamsInterface } from '../../../../shared/type/query-params.interface';
import { CategoryResponseInterface } from '../../../type/category-response.interface';
import { MatBadge } from '@angular/material/badge';
import { DispatchActionService } from '../../../../shared/service/dispatch-action.service';

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
    MatBadge,
  ],
  providers: [CategoryService],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit {
  title = 'Kategorie Management';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    category: this.store.select(selectCategoryTableData),
    isLoading: this.store.select(selectCategoryIsLoading),
    error: this.store.select(selectCategoryError),
    totalElements: this.store.select(selectCategoryTotalElements),
    pageSizeOptions: this.store.select(selectCategoryPageSizeOptions),
    queryParams: this.store.select(selectCategoryQueryParams),
    isSubmitting: this.store.select(selectCategoryIsSubmitting),
    areLoaded: this.store.select(selectCategoryAreLoaded),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  // Booleans indicating whether data is currently being fetched or submitted to the database
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // Columns to display in the table
  displayedColumnsDesktop: string[] = ['edit', 'id', 'name', 'groups'];

  // Columns to display in the table
  displayedColumnsMobile: string[] = ['edit', 'id', 'name'];

  // Currently expanded user
  expandedCategory: CategoryResponseInterface | null = null;

  // Maximum number of users to display in the list
  maxUsersVisibleDesktop = 9;
  maxUsersVisibleMobile = 5;

  // Search control for the search input field
  searchControl: FormControl = new FormControl('');

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
      this.queryParams = {
        pageNumber: data.queryParams.pageNumber,
        pageSize: data.queryParams.pageSize,
        sort: data.queryParams.sort,
        search: data.queryParams.search,
      };

      this.isLoading = data.isLoading;
      this.isSubmitting = data.isSubmitting;
    });

    // Using the DispatchActionService to check if the data are loaded.
    // If not loaded, it dispatches the action to get the data with a query.
    this.dispatchActionService.checkAndDispatchAction(this.store.select(selectCategoryAreLoaded), () =>
      this.dispatchGetCategoriesWithQueryAction()
    );

    // sets initial the store value of search
    this.searchControl.setValue(this.queryParams.search);

    // Subscribe to the search control value changes and debounce them to prevent too many requests
    this.searchControl.valueChanges
      .pipe(debounceTime(700)) //
      .subscribe(value => {
        this.searchCategories(value);
      });
  }

  /**
   * Opens a dialog to create a new category.
   */
  createNewCategory() {
    openCreateCategoryDialog(this.dialog, null)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        const newCategory: CategoryRequestInterface = {
          ...val,
        };
        this.store.dispatch(categoryActions.createCategory({ category: newCategory }));
      });
  }

  /**
   * Opens a dialog to update an existing category.
   */
  editCategoryUsers(category: CategoryResponseInterface) {
    openCreateCategoryDialog(this.dialog, category)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        const id: number = category.id;
        const newCategory: CategoryRequestInterface = {
          ...val,
        };
        console.log(newCategory);

        this.store.dispatch(categoryActions.updateCategory({ id, category: newCategory }));
      });
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve categories with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.queryParams = {
      ...this.queryParams,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    this.dispatchGetCategoriesWithQueryAction();
  }

  /**
   * Dispatches an action to fetch categories data based on the current pagination and sorting options.
   */
  private dispatchGetCategoriesWithQueryAction() {
    this.store.dispatch(categoryActions.getCategoriesWithQuery({ queryParams: this.queryParams }));
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

    this.dispatchGetCategoriesWithQueryAction();
  }

  /**
   * Sorts an array of names alphabetically and joins them into a single string.
   *
   * @param names An array of category names to be sorted and joined.
   * @param trunc A boolean indicating whether the string should be truncated, when the list is too long.
   * @param maxGroupsVisible truncate the list up to this number of users.
   * @return A string containing the sorted category names joined by commas.
   */
  sortAndJoinNames(names: string[], trunc: boolean, maxGroupsVisible: number): string {
    const sortedNames = names.slice().sort().join(', ');
    if (trunc) {
      const truncatedSortedNames = names.slice().sort().slice(0, maxGroupsVisible).join(', ');
      return truncatedSortedNames + '...';
    }
    return sortedNames;
  }

  /**
   * Toggles the expansion of a user row to display the details.
   * @param category The category for which to toggle the row expansion.
   */
  onToggleExpandedCategoryRow(category: CategoryResponseInterface) {
    if (category == this.expandedCategory) {
      this.expandedCategory = null;
    } else {
      this.expandedCategory = category;
    }
  }

  checkIsLoadingIsSubmitting(): boolean {
    return this.isLoading || this.isSubmitting;
  }

  searchCategories(search: string) {
    this.queryParams = {
      ...this.queryParams,
      search: search.trim(),
    };

    this.dispatchGetCategoriesWithQueryAction();
  }
}
