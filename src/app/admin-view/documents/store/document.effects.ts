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

export const getDocumentsEffect = createEffect(
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      ofType(documentActions.getDocuments),
      switchMap(() => {
        return documentService.getDocuments().pipe(
          map((document: DocumentResponseInterface[]) => {
            return documentActions.getDocumentsSuccess({ document });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(documentActions.getDocumentsFailure(errorResponse.error));
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
      ofType(documentActions.getDocumentsFailure),
      tap(() => {
        store.select(selectError).subscribe(error => {
          snackbarService.openSnackBar('Fehler beim laden der Dokumente. \nError:' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false }
);
