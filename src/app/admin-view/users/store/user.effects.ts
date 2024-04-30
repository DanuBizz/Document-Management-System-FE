import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { userActions } from './user.actions';
import { UserResponseInterface } from '../../type/user-response.interface';
import { UserService } from '../../../shared/service/user.service';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectError } from '../../categories/store/category.reducers';

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

export const openSnackbarErrorEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type 'getAllCategoriesFailure'
      ofType(userActions.getAllUsersFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim laden der User. \nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // indicates not to dispatch any actions
);
