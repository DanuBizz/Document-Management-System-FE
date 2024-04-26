import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentService } from '../../../shared/service/document.service';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { documentActions } from './document.actions';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectError } from '../../categories/store/category.reducers';

// Effect to fetch documents
export const getDocumentsEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type 'getDocuments'
      ofType(documentActions.getDocuments),
      switchMap(() => {
        // Calling the service method to fetch documents
        return documentService.getDocuments().pipe(
          map((document: DocumentResponseInterface[]) => {
            // Dispatching action when documents are successfully fetched
            return documentActions.getDocumentsSuccess({ document });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.getDocumentsFailure(errorResponse.error));
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
      // Listening for actions of type 'getDocumentsFailure'
      ofType(documentActions.getDocumentsFailure),
      tap(() => {
        // Subscribing to selectError selector to get the error from the store
        store.select(selectError).subscribe(error => {
          // Opening a snackbar to display the error message
          snackbarService.openSnackBar('Fehler beim Laden der Dokumente.\nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false } // Marks the effect as functional and indicates not to dispatch any actions
);