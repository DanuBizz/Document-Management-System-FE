import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { userActions } from './user.actions';
import { UserResponseInterface } from '../../type/user-response.interface';
import { UserService } from '../../../shared/service/user.service';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectUserError, selectUserPagination } from './user.reducers';

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
      switchMap(({ pagination }) => {
        // Calling the service method
        return userService.fetchUsersWitQuery(pagination).pipe(
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

/**
 * Effect for displaying a snackbar notification and dispatch new action.
 * Upon receiving such a success-action, it displays a snackbar notification containing the success message
 * using the provided SnackbarService. It then retrieves the current query parameters from the store
 * and dispatches the 'get' action to fetch updated data.
 */
export const openSnackbarSuccessEffect = createEffect(
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService)) => {
    return actions$.pipe(
      ofType(userActions.changeUserRoleSuccess),
      tap(({ message }) => {
        snackbarService.openSnackBar(message);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const openSnackbarErrorEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(userActions.getAllUsersFailure, userActions.getUsersWithQueryFailure, userActions.changeUserRoleFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectUserError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler bei Übermittlung der User. \nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // indicates not to dispatch any actions
);

/**
 * Effect for dispatching a new action to refresh the table data
 * Upon receiving such an action, it dispatches the 'get' action to fetch updated data.
 */
export const refreshGetUserWithQuery = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(userActions.changeUserRoleSuccess, userActions.changeUserRoleFailure),
      mergeMap(() => {
        return store
          .select(selectUserPagination)
          .pipe(map(pagination => userActions.getUsersWithQuery({ pagination })));
      })
    );
  },
  { functional: true, dispatch: true }
);
