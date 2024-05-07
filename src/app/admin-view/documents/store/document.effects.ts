import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap, take } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { documentActions } from './document.actions';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectDocumentError, selectDocumentPagination } from './document.reducers';
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

// Effect to open a snackbar with error message when fetching documents fails
export const openSnackbarErrorEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(
        documentActions.getDocumentsWithQueryFailure,
        documentActions.createDocumentVersionFailure,
        documentActions.changeDocumentVisibilityFailure
      ),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectDocumentError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler bei der Übermittlung.\nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // Indicates not to dispatch any actions
);

/**
 * Effect for displaying a snackbar notification and dispatch get documents action.
 * Upon receiving such a success-action, it displays a snackbar notification containing the success message
 * using the provided SnackbarService. It then retrieves the current query parameters from the store
 * and dispatches the 'get' action to fetch updated data.
 */
export const openSnackbarSuccessEffect = createEffect(
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService)) => {
    return actions$.pipe(
      ofType(documentActions.createDocumentVersionSuccess, documentActions.changeDocumentVisibilitySuccess),
      tap(({ message }) => {
        snackbarService.openSnackBar(message);
      })
    );
  },
  { functional: true, dispatch: false }
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
