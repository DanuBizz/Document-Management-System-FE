import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { PaginationConfigService } from '../../../../shared/service/pagination-config.service';
import { UserResponseInterface } from '../../../type/user-response.interface';
import { combineLatest, debounceTime } from 'rxjs';
import {
  selectTotalUserElements,
  selectUserAreLoaded,
  selectUserError,
  selectUserIsLoading,
  selectUserIsSubmitting,
  selectUserQueryParams,
  selectUserTableData,
} from '../../store/user/user.reducers';
import { userActions } from '../../store/user/user.actions';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { selectCurrentUser } from '../../../../auth/store/auth.reducers';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FabButtonComponent } from '../../../../shared/component/fab-button/fab-button.component';
import { MatOption, MatSelect } from '@angular/material/select';
import { DispatchActionService } from '../../../../shared/service/dispatch-action.service';
import { QueryParamsInterface } from '../../../../shared/type/query-params.interface';

@Component({
  selector: 'app-user-role-management',
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
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FabButtonComponent,
    MatSelect,
    MatOption,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  title = 'Benutzer Management';

  // Columns to display in the table
  displayedMobileColumns: string[] = ['id', 'username', 'isAdmin'];
  displayedDesktopColumns: string[] = ['id', 'username', 'email', 'isAdmin', 'groups'];

  // Currently expanded user
  expandedUser: UserResponseInterface | null = null;

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    users: this.store.select(selectUserTableData),
    isLoading: this.store.select(selectUserIsLoading),
    error: this.store.select(selectUserError),
    totalElements: this.store.select(selectTotalUserElements),
    currentUser: this.store.select(selectCurrentUser),
    queryParams: this.store.select(selectUserQueryParams),
    isSubmitting: this.store.select(selectUserIsSubmitting),
  });

  // Pagination and sorting properties for the component ts file
  queryParams!: QueryParamsInterface;

  // Booleans indicating whether data is currently being fetched or submitted to the database
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // Search control for the search input field
  searchControl: FormControl = new FormControl('');

  userGroupsControl: FormControl = new FormControl('');
  groups: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(
    private store: Store,
    public paginationConfigService: PaginationConfigService,
    private changeDetectorRef: ChangeDetectorRef,
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
      this.changeDetectorRef.detectChanges();
    });

    // Using the DispatchActionService to check if the data are loaded.
    // If not loaded, it dispatches the action to get the data with a query.
    this.dispatchActionService.checkAndDispatchAction(this.store.select(selectUserAreLoaded), () =>
      this.dispatchGetUsersWithQueryAction()
    );

    // sets initial the store value of search
    this.searchControl.setValue(this.queryParams.search);

    // Subscribe to the search control value changes and debounce them to prevent too many requests
    this.searchControl.valueChanges
      .pipe(debounceTime(700)) //
      .subscribe(value => {
        this.searchUsers(value);
      });
  }

  /**
   * Toggles the expansion of a user row to display the details.
   * @param user The user for which to toggle the row expansion.
   */
  onToggleExpandedUserRow(user: UserResponseInterface) {
    if (user == this.expandedUser) {
      this.expandedUser = null;
    } else {
      this.expandedUser = user;
    }
  }

  /**
   * Handles page events by updating the pagination configuration service with the new page size,
   * constructing a pagination query interface to retrieve users with query parameter.
   * @param event - The PageEvent object containing information about the page event.
   */
  handlePageEvent(event: PageEvent) {
    this.queryParams = {
      ...this.queryParams,
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };
    this.dispatchGetUsersWithQueryAction();
  }

  /**
   * Toggles the admin role state of the user with the specified ID.
   *
   * @param id The ID of the user.
   * @param role The current state of the user's admin role.
   */
  toggleUserIsAdmin(id: number, role: boolean) {
    // Dispatch an action to change the currentState of isAdmin
    this.store.dispatch(userActions.changeUserRole({ id: id, isAdmin: !role }));
  }

  /**
   * Dispatches an action to fetch user data based on the current pagination and sorting options.
   */
  private dispatchGetUsersWithQueryAction(): void {
    this.store.dispatch(userActions.getUsersWithQuery({ queryParams: this.queryParams }));
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

    this.dispatchGetUsersWithQueryAction();
  }

  checkIsLoadingIsSubmitting(): boolean {
    return this.isLoading || this.isSubmitting;
  }

  searchUsers(search: string) {
    this.queryParams = {
      ...this.queryParams,
      search: search.trim(),
    };

    this.dispatchGetUsersWithQueryAction();
  }

  changeUserGroups() {
    // wenn control value gleich ist wie user.gruppen, dann nichts machen

    console.log(this.userGroupsControl.value);
  }
}
