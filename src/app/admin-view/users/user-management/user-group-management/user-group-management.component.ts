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
import { UserResponseInterface } from '../../../type/user-response.interface';
import { combineLatest } from 'rxjs';
import {
  selectTotalUserElements,
  selectUserError,
  selectUserIsLoading,
  selectUserIsSubmitting,
  selectUserPagination,
  selectUserTableData,
} from '../../store/user.reducers';
import { selectCurrentUser } from '../../../../auth/store/auth.reducers';
import { PaginationQueryParamsInterface } from '../../../../shared/type/pagination-query-params.interface';
import { Store } from '@ngrx/store';
import { PaginationConfigService } from '../../../../shared/service/pagination-config.service';
import { userActions } from '../../store/user.actions';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './user-group-management.component.html',
  styleUrl: './user-group-management.component.scss',
})
export class UserGroupManagementComponent implements OnInit {
  title = 'User Gruppen Veraltung';

  // Columns to display in the table
  displayedMobileColumns: string[] = ['id', 'username', 'isAdmin'];
  displayedDesktopColumns: string[] = ['id', 'username', 'email', 'isAdmin'];

  // Currently expanded user
  expandedUser: UserResponseInterface | null = null;

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    users: this.store.select(selectUserTableData),
    isLoading: this.store.select(selectUserIsLoading),
    error: this.store.select(selectUserError),
    totalElements: this.store.select(selectTotalUserElements),
    currentUser: this.store.select(selectCurrentUser),
    pagination: this.store.select(selectUserPagination),
    isSubmitting: this.store.select(selectUserIsSubmitting),
  });

  // Pagination and sorting properties for the component ts file
  pagination!: PaginationQueryParamsInterface;

  // Booleans indicating whether data is currently being fetched or submitted to the database
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private store: Store,
    public paginationConfigService: PaginationConfigService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.pagination = {
        pageNumber: data.pagination.pageNumber,
        pageSize: data.pagination.pageSize,
        sort: data.pagination.sort,
      };

      this.isLoading = data.isLoading;
      this.isSubmitting = data.isSubmitting;
    });

    this.dispatchGetUsersWithQueryAction();
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
    this.pagination = {
      ...this.pagination,
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
    this.store.dispatch(userActions.getUsersWithQuery({ pagination: this.pagination }));
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

    this.dispatchGetUsersWithQueryAction();
  }

  checkIsLoadingIsSubmitting(): boolean {
    return this.isLoading || this.isSubmitting;
  }
}
