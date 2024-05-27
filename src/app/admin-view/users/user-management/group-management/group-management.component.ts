import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSortModule, Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupResponseInterface } from '../../../type/group-response-interface';
import { combineLatest, debounceTime } from 'rxjs';
import {
  selectGroupAllData,
  selectGroupAreLoaded,
  selectGroupError,
  selectGroupIsLoading,
  selectGroupIsSubmitting,
  selectGroupQueryParams,
  selectGroupTableData,
  selectTotalGroupElements,
} from '../../store/group/group.reducers';
import { Store } from '@ngrx/store';
import { PaginationConfigService } from '../../../../shared/service/pagination-config.service';
import { DispatchActionService } from '../../../../shared/service/dispatch-action.service';
import { groupActions } from '../../store/group/group.actions';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { QueryParamsInterface } from '../../../../shared/type/query-params.interface';
import { FabButtonComponent } from '../../../../shared/component/fab-button/fab-button.component';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'app-user-group-management',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatProgressBar,
    MatRow,
    MatRowDef,
    MatSortModule,
    MatTable,
    NgIf,
    DatePipe,
    MatHeaderCellDef,
    MatSlideToggle,
    FormsModule,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FabButtonComponent,
    MatBadge,
    MatError,
  ],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.scss',
})
export class GroupManagementComponent implements OnInit {
  // Columns to display in the table
  displayedDesktopColumns: string[] = ['id', 'name', 'usernames'];
  displayedMobileColumns: string[] = ['id', 'name'];

  // Currently expanded user
  expandedGroup: GroupResponseInterface | null = null;

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    groups: this.store.select(selectGroupTableData),
    isLoading: this.store.select(selectGroupIsLoading),
    error: this.store.select(selectGroupError),
    totalElements: this.store.select(selectTotalGroupElements),
    queryParams: this.store.select(selectGroupQueryParams),
    isSubmitting: this.store.select(selectGroupIsSubmitting),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  // Booleans indicating whether data is currently being fetched or submitted to the database
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // Search control for the search input field
  searchControl: FormControl = new FormControl('');

  // Maximum number of users to display in the list
  maxUsersVisibleDesktop = 10;
  maxUsersVisibleMobile = 5;

  groupControl!: FormControl;

  allGroups: GroupResponseInterface[] = [];

  constructor(
    private store: Store,
    public paginationConfigService: PaginationConfigService,
    private dispatchActionService: DispatchActionService,
    private fb: FormBuilder
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
    this.dispatchActionService.checkAndDispatchAction(this.store.select(selectGroupAreLoaded), () =>
      this.dispatchGetGroupsWithQueryAction()
    );

    // sets initial the store value of search
    this.searchControl.setValue(this.queryParams.search);

    // Subscribe to the search control value changes and debounce them to prevent too many requests
    this.searchControl.valueChanges
      .pipe(debounceTime(700)) //
      .subscribe(value => {
        this.searchGroups(value);
      });

    this.store
      .select(selectGroupAllData)
      .pipe()
      .subscribe(groups => {
        this.allGroups = groups;
      });

    // Initialize the form
    this.initializeForm();
  }

  /**
   * Initializes the form with form controls and validators.
   */
  initializeForm() {
    this.groupControl = new FormControl('', [Validators.required, this.validateDocumentCategoryName.bind(this)]);
  }

  /**
   * Validates the name of a document category to ensure it is not a duplicate.
   * @param control The form control containing the name of the document category.
   * @returns An object with a 'duplicateName' key set to true if the name is a duplicate, or null if the name is unique.
   */
  validateDocumentCategoryName(control: FormControl): { [key: string]: boolean } | null {
    const existingDocCategory = this.allGroups.find(group => group.name.toLowerCase() === control.value.toLowerCase());
    return existingDocCategory ? { duplicateName: true } : null;
  }

  /**
   * Toggles the expansion of a row to display the details.
   * @param group to toggle the row expansion.
   */
  onToggleExpandedUserRow(group: GroupResponseInterface) {
    if (group == this.expandedGroup) {
      this.expandedGroup = null;
    } else {
      this.expandedGroup = group;
    }
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve data's with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.queryParams = {
      ...this.queryParams,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };
    this.dispatchGetGroupsWithQueryAction();
  }

  /**
   * Dispatches an action to fetch user data based on the current pagination and sorting options.
   */
  private dispatchGetGroupsWithQueryAction(): void {
    this.store.dispatch(groupActions.getGroupsWithQuery({ queryParams: this.queryParams }));
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

    this.dispatchGetGroupsWithQueryAction();
  }

  checkIsLoadingIsSubmitting(): boolean {
    return this.isLoading || this.isSubmitting;
  }
  searchGroups(search: string) {
    this.queryParams = {
      ...this.queryParams,
      search: search.trim(),
    };

    this.dispatchGetGroupsWithQueryAction();
  }

  createNewGroup() {}

  /**
   * Sorts an array of names alphabetically and joins them into a single string.
   *
   * @param names An array of category names to be sorted and joined.
   * @param trunc A boolean indicating whether the string should be truncated, when the list is too long.
   * @param maxUserVisible truncate the list up to this number of users.
   * @return A string containing the sorted category names joined by commas.
   */
  sortAndJoinNames(names: string[], trunc: boolean, maxUserVisible: number): string {
    const sortedNames = names.slice().sort().join(', ');
    if (trunc) {
      const truncatedSortedNames = names.slice().sort().slice(0, maxUserVisible).join(', ');
      return truncatedSortedNames + '...';
    }
    return sortedNames;
  }

  /**
   * Toggles the expansion of a row to display the details.
   * @param group to toggle the row expansion.
   */
  onToggleExpandedCategoryRow(group: GroupResponseInterface) {
    if (group == this.expandedGroup) {
      this.expandedGroup = null;
    } else {
      this.expandedGroup = group;
    }
  }
}
