import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { userActions } from './user.actions';
import { UserResponseInterface } from '../../../type/user-response.interface';
import { UserService } from '../../../../shared/service/user.service';
import { Store } from '@ngrx/store';
import { selectUserQueryParams } from './user.reducers';
import { selectGroupQueryParams } from '../group/group.reducers';
import { groupActions } from '../group/group.actions';

export const getAllUsersEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      // Listening for actions of type 'getAllCategories'
      ofType(userActions.getAllUsers),
      switchMap(() => {
        // Calling the service method to fetch all categories
        return userService.fetchAllUsers().pipe(
          map((user: UserResponseInterface[]) => {
            // Dispatching action when categories are successfully fetched
            return userActions.getAllUsersSuccess({ user });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(userActions.getAllUsersFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const getUsersWithQuery = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(userActions.getUsersWithQuery),
      switchMap(({ queryParams }) => {
        // Calling the service method
        return userService.fetchUsersWitQuery(queryParams).pipe(
          map(users =>
            // Handling the response and dispatching action when successful
            userActions.getUsersWithQuerySuccess({
              users: users.users,
              totalElements: users.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(userActions.getUsersWithQueryFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const changeUserRoleEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(userActions.changeUserRole),
      switchMap(({ id, isAdmin }) => {
        // Calling the service method
        return userService.updateUserRole(id, isAdmin).pipe(
          map(({ message }) =>
            // Handling the response and dispatching action when successful
            userActions.changeUserRoleSuccess({ message })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(userActions.changeUserRoleFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const changeUserGroupsEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(userActions.changeUserGroups),
      switchMap(({ id, groupIds }) => {
        // Calling the service method
        return userService.updateUserGroups(id, groupIds).pipe(
          map(() =>
            // Handling the response and dispatching action when successful
            userActions.changeUserGroupsSuccess()
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(userActions.changeUserGroupsFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

/**
 * Effect for dispatching a new action to refresh the table data
 * Upon receiving such an action, it dispatches the 'get' action to fetch updated data.
 */
export const refreshUserTableData = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(
        userActions.changeUserRoleSuccess,
        userActions.changeUserRoleFailure,
        userActions.changeUserGroupsSuccess,
        userActions.changeUserGroupsFailure
      ),
      mergeMap(() => {
        return store
          .select(selectUserQueryParams)
          .pipe(map(queryParams => userActions.getUsersWithQuery({ queryParams: queryParams })));
      })
    );
  },
  { functional: true, dispatch: true }
);

/**
 * Effect for dispatching a new action to refresh the table data
 * Upon receiving such an action, it dispatches the 'get' action to fetch updated data.
 */
export const refreshGroupTableData = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(userActions.changeUserGroupsSuccess, userActions.changeUserGroupsFailure),
      mergeMap(() => {
        return store
          .select(selectGroupQueryParams)
          .pipe(map(queryParams => groupActions.getGroupsWithQuery({ queryParams: queryParams })));
      })
    );
  },
  { functional: true, dispatch: true }
);
