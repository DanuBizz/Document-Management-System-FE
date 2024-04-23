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
  (actions$ = inject(Actions), categoriesService = inject(CategoryService)) => {
    return actions$.pipe(
      ofType(categoryActions.getAllCategories),
      switchMap(() => {
        return categoriesService.getAllCategories().pipe(
          map((category: CategoryResponseInterface[]) => {
            return categoryActions.getAllCategoriesSuccess({ category });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(categoryActions.getAllCategoriesFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const openSnackbarEffect = createEffect(
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(categoryActions.getAllCategoriesFailure),
      tap(() => {
        store.select(selectError).subscribe(error => {
          snackbarService.openSnackBar('Fehler beim laden der Kategorien. \nError:' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false }
);
