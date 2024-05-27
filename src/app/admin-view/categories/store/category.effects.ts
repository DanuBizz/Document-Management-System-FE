import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryService } from '../../../shared/service/category.service';
import { categoryActions } from './category.actions';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectCategoryQueryParams } from './category.reducers';

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
        return categoryService.fetchCategoriesWithQuery(queryParams).pipe(
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

/**
 * Effect for handling the creation of a new category.
 * This effect listens for actions of type 'categoryActions.createCategory'.
 * using the provided CategoryService. If the creation is successful,
 * it dispatches the 'createCategorySuccess' action with a success message,
 * otherwise, it dispatches the 'createCategoryFailure' action with the error details.
 */
export const createCategoryEffect = createEffect(
  (actions$ = inject(Actions), categoriesService = inject(CategoryService)) => {
    return actions$.pipe(
      ofType(categoryActions.createCategory),
      switchMap(({ category }) => {
        return categoriesService.createCategory(category).pipe(
          map(({ message }) => {
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
 * Effect for handling the update of an existing category.
 * This effect listens for actions of type 'categoryActions.updateCategory'.
 * using the provided CategoryService. If the update is successful,
 * it dispatches the 'updateCategorySuccess' action with a success message,
 * otherwise, it dispatches the 'updateCategoryFailure' action with the error details.
 */
export const updateCategoryEffect = createEffect(
  (actions$ = inject(Actions), categoriesService = inject(CategoryService)) => {
    return actions$.pipe(
      ofType(categoryActions.updateCategory),
      switchMap(({ id, userIds }) => {
        return categoriesService.updateCategoryUsers(id, userIds).pipe(
          map(({ message }) => {
            return categoryActions.updateCategorySuccess({ message });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(categoryActions.updateCategoryFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

/**
 * dispatches the actions to fetch updated category data.
 */
export const refreshGetCategoriesEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(categoryActions.createCategorySuccess, categoryActions.updateCategorySuccess),
      switchMap(() =>
        store.select(selectCategoryQueryParams).pipe(
          mergeMap(queryParams => {
            const action = categoryActions.getCategoriesWithQuery({ queryParams: queryParams });
            return of(action);
          })
        )
      )
    );
  },
  { functional: true, dispatch: true }
);
