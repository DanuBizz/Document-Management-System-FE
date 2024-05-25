import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap, take } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { documentActions } from './document.actions';
import { Store } from '@ngrx/store';
import { selectDocumentPagination } from './document.reducers';
import { DocumentService } from '../../../shared/service/document.service';

export const getDocumentsWithQuery = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQuery),
      switchMap(({ pagination }) => {
        // Calling the service method to fetch documents
        return documentService.fetchDocumentsWithAssociatedVersionsWithQuery(pagination).pipe(
          map(documents =>
            // Handling the response and dispatching action when successful
            documentActions.getDocumentsWithQuerySuccess({
              documents: documents.documents,
              totalElements: documents.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.getDocumentsWithQueryFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const createDocumentVersionEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.createDocumentVersion),
      switchMap(({ doc }) => {
        // Calling the service method to create document
        return documentService.createDocVersion(doc).pipe(
          map(({ message }) =>
            // Handling the response and dispatching action when successful
            documentActions.createDocumentVersionSuccess({ message })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.createDocumentVersionFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const changeDocumentVisibilityEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.changeDocumentVisibility),
      switchMap(({ id }) => {
        // Calling the service method to create document
        return documentService.updateDocumentVisibility(id).pipe(
          map(({ message }) =>
            // Handling the response and dispatching action when successful
            documentActions.changeDocumentVisibilitySuccess({ message })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.changeDocumentVisibilityFailure(errorResponse.error));
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
export const refreshGetDocumentWithQueryEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(documentActions.createDocumentVersionSuccess, documentActions.changeDocumentVisibilitySuccess),
      mergeMap(() => {
        return store.select(selectDocumentPagination).pipe(
          take(1),
          map(pagination => documentActions.getDocumentsWithQuery({ pagination }))
        );
      })
    );
  },
  { functional: true, dispatch: true }
);
