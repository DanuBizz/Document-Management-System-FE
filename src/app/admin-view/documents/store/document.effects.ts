import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentService } from '../../../shared/service/document.service';
import { documentActions } from './document.actions';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectError } from '../../categories/store/category.reducers';
import { DocVersionService } from '../../../shared/service/docVersion.service';

export const getDocumentsWithQuery = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQuery),
      switchMap(({ queryParams }) => {
        // Calling the service method to fetch documents
        return documentService.fetchDocumentsWithQuery({ queryParams }).pipe(
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
export const openSnackbarEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQueryFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim Laden der Dokumente.\nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // Indicates not to dispatch any actions
);

export const createDocumentVersionEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), docVersionService = inject(DocVersionService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.createDocumentVersion),
      switchMap(({ doc }) => {
        // Calling the service method to fetch documents
        return docVersionService.createDocVersion(doc).pipe(
          map(() =>
            // Handling the response and dispatching action when successful
            documentActions.createDocumentVersionSuccess()
          ),
          catchError(() => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.createDocumentVersionFailure());
          })
        );
      })
    );
  },
  { functional: true }
);
