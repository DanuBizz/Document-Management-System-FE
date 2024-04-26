import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CategoryService } from '../../../shared/service/category.service';
import { categoryActions } from './category.actions';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectError } from './category.reducers';

export const getCategoriesEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), categoriesService = inject(CategoryService)) => {
    return actions$.pipe(
      // Listening for actions of type 'getAllCategories'
      ofType(categoryActions.getAllCategories),
      switchMap(() => {
        // Calling the service method to fetch all categories
        return categoriesService.getAllCategories().pipe(
          map((category: CategoryResponseInterface[]) => {
            // Dispatching action when categories are successfully fetched
            return categoryActions.getAllCategoriesSuccess({ category });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(categoryActions.getAllCategoriesFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const openSnackbarEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type 'getAllCategoriesFailure'
      ofType(categoryActions.getAllCategoriesFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim laden der Kategorien. \nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // indicates not to dispatch any actions
);