import {Actions, createEffect, ofType} from '@ngrx/effects';
import {inject} from '@angular/core';
import {map, mergeMap, of, switchMap, take} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {CategoryService} from '../../../shared/service/category.service';
import {categoryActions} from './category.actions';
import {CategoryResponseInterface} from '../../type/category-response.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {SnackbarService} from '../../../shared/service/snackbar.service';
import {Store} from '@ngrx/store';
import {selectError, selectQueryParams} from './category.reducers';

export const getAllCategoriesEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), categoriesService = inject(CategoryService)) => {
    return actions$.pipe(
      // Listening for actions of type 'getAllCategories'
      ofType(categoryActions.getAllCategories),
      switchMap(() => {
        // Calling the service method to fetch all categories
        return categoriesService.fetchAllCategories().pipe(
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

export const getCategoryWithQueryEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), categoryService = inject(CategoryService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(categoryActions.getCategoriesWithQuery),
      switchMap(({ queryParams }) => {
        // Calling the service method to fetch documents
        return categoryService.fetchCategoriesWithQuery({ queryParams }).pipe(
          map(categories =>
            // Handling the response and dispatching action when successful
            categoryActions.getCategoriesWithQuerySuccess({
              categories: categories.categories,
              totalElements: categories.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(categoryActions.getCategoriesWithQueryFailure(errorResponse.error));
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
      ofType(categoryActions.getAllCategoriesFailure, categoryActions.getCategoriesWithQueryFailure),
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

/**
 * Effect for handling the creation of a new category.
 * This effect listens for actions of type 'categoryActions.createCategory'.
 * using the provided CategoryService. If the creation is successful,
 * it dispatches the 'createCategorySuccess' action with a success message,
 * otherwise, it dispatches the 'createCategoryFailure' action with the error details.
 */
export const createCategoryEffect = createEffect(
    (actions$ = inject(Actions),
     categoriesService = inject(CategoryService)) => {
        return actions$.pipe(
            ofType(categoryActions.createCategory),
            switchMap(({category}) => {
                return categoriesService.createCategory(category).pipe(
                    map(({message}) => {
                        return categoryActions.createCategorySuccess({ message });
                    }),
                    catchError((errorResponse: HttpErrorResponse) => {
                        return of(categoryActions.createCategoryFailure(errorResponse.error));
                    })
                );
            })
        );
    },
    { functional: true }
);

/**
 * Effect for displaying a snackbar notification and dispatch get categories action.
 * This effect listens for actions of type 'categoryActions.createCategorySuccess'.
 * Upon receiving such an action, it displays a snackbar notification containing the success message
 * using the provided SnackbarService. It then retrieves the current query parameters from the store
 * and dispatches the 'getCategoriesWithQuery' action to fetch updated category data.
 */
export const openSnackbarSuccessEffect = createEffect(
    (actions$ = inject(Actions),
     snackbarService = inject(SnackbarService),
     store = inject(Store)) => {
        return actions$.pipe(
            ofType(categoryActions.createCategorySuccess),
            tap(({message}) => {
                snackbarService.openSnackBar(message);
            }),
            mergeMap(() => {
                return store.select(selectQueryParams).pipe(
                    take(1), // Hier wird nur ein einziges Mal abonniert, um die aktuellen Query-Parameter zu erhalten
                    map(queryParams => categoryActions.getCategoriesWithQuery({ queryParams }))
                );
            })
        );
    },
    { functional: true, dispatch: true}
);
