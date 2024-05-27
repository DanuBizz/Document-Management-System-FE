import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { docCategoryActions } from './doc-category.actions';
import { DocumentCategoryService } from '../../service/document-category.service';
import { DocCategoryResponseInterface } from '../../type/doc-category-response.interface';

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
