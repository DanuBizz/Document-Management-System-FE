import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
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
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSort} from '@angular/material/sort';
import {MatIcon} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {PaginationConfigService} from '../../../shared/service/pagination-config.service';
import {PaginationQueryParamsInterface} from '../../../shared/type/pagination-query-params.interface';
import {UserResponseInterface} from '../../type/user-response.interface';
import {combineLatest} from 'rxjs';
import {selectTotalUserElements, selectUserData, selectUserError, selectUserIsLoading} from '../store/user.reducers';
import {userActions} from '../store/user.actions';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-management',
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
    MatSort,
    MatTable,
    NgIf,
    DatePipe,
    MatHeaderCellDef,
    MatSlideToggle,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  title = 'User Management';

  // Columns to display in the table
  displayedColumns: string[] = ['id', 'name', 'role'];

  // Currently expanded user
  expandedUser: UserResponseInterface | null = null;

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    users: this.store.select(selectUserData),
    isLoading: this.store.select(selectUserIsLoading),
    error: this.store.select(selectUserError),
    totalElements: this.store.select(selectTotalUserElements),
  });

  constructor(
    private store: Store,
    public paginationConfigService: PaginationConfigService
  ) {}

  ngOnInit(): void {
    this.loadInitialUsersPage();
  }

  loadInitialUsersPage() {
    const request: PaginationQueryParamsInterface = {
      pageNumber: this.paginationConfigService.getInitialPageIndex(),
      pageSize: this.paginationConfigService.getPageSize(),
    };

    // Dispatch an action to retrieve users with the pagination query
    this.store.dispatch(userActions.getUsersWithQuery({ queryParams: request }));
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
    this.paginationConfigService.setPageSize(event.pageSize);

    const request: PaginationQueryParamsInterface = {
      pageNumber: event.pageIndex.toString(),
      pageSize: event.pageSize.toString(),
    };

    // Dispatch an action to retrieve documents with the updated pagination query
    this.store.dispatch(userActions.getUsersWithQuery({ queryParams: request }));
  }

  changeUserRole(id: number, role: boolean) {
    // Dispatch an action to change the currentState of isAdmin
    this.store.dispatch(userActions.changeUserRole({ id: id, isAdmin: !role }));
  }
}
