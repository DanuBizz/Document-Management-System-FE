import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../service/snackbar.service';
import { Store } from '@ngrx/store';
import { docCategoryActions } from './doc-category.actions';
import { DocumentCategoryService } from '../service/document-category.service';
import { DocCategoryResponseInterface } from '../type/doc-category-response.interface';
import { selectDocCategoryError } from './doc-category.reducers';

export const getAllDocCategoryEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentCategoryService = inject(DocumentCategoryService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(docCategoryActions.getAllDocumentCategories),
      switchMap(() => {
        // Calling the service method to fetch
        return documentCategoryService.fetchAllDocumentCategories().pipe(
          map((docCategory: DocCategoryResponseInterface[]) => {
            // Dispatching action when successfully fetched
            return docCategoryActions.getAllDocumentCategoriesSuccess({ docCategory });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(docCategoryActions.getAllDocumentCategoriesFailure(errorResponse.error));
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
      // Listening for actions of type
      ofType(docCategoryActions.getAllDocumentCategoriesFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectDocCategoryError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim laden der Document Kategorien. \nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // indicates not to dispatch any actions
);
