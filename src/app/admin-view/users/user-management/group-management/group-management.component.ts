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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupResponseInterface } from '../../../type/group-response-interface';
import { combineLatest, debounceTime } from 'rxjs';
import {
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
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { QueryParamsInterface } from '../../../../shared/type/query-params.interface';

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
  ],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.scss',
})
export class GroupManagementComponent implements OnInit {
  title = 'Gruppen Management';

  // Columns to display in the table
  displayedDesktopColumns: string[] = ['name', 'usernames'];

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

  constructor(
    private store: Store,
    public paginationConfigService: PaginationConfigService,
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

    //this.store.dispatch(userActions.getUsersWithQuery({ queryParams: this.queryParams }));
  }
}
