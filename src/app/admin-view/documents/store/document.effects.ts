import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap, take } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { documentActions } from './document.actions';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectError } from '../../categories/store/category.reducers';
import { selectQueryParams } from './document.reducers';
import { DocumentService } from '../../../shared/service/document.service';

export const getDocumentsWithQuery = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQuery),
      switchMap(({ queryParams }) => {
        // Calling the service method to fetch documents
        return documentService.fetchDocumentsWithAssociatedVersionsWithQuery({ queryParams }).pipe(
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

// Effect to open a snackbar with error message when fetching documents fails
export const openSnackbarErrorEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQueryFailure, documentActions.createDocumentVersionFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim Laden/Hochladen der Dokumente.\nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // Indicates not to dispatch any actions
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

/**
 * Effect for displaying a snackbar notification and dispatch get documents action.
 * Upon receiving such a success-action, it displays a snackbar notification containing the success message
 * using the provided SnackbarService. It then retrieves the current query parameters from the store
 * and dispatches the 'get' action to fetch updated data.
 */
export const openSnackbarSuccessEffect = createEffect(
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(documentActions.createDocumentVersionSuccess),
      tap(({ message }) => {
        snackbarService.openSnackBar(message);
      }),
      mergeMap(() => {
        return store.select(selectQueryParams).pipe(
          take(1),
          map(queryParams => documentActions.getDocumentsWithQuery({ queryParams }))
        );
      })
    );
  },
  { functional: true, dispatch: true }
);
