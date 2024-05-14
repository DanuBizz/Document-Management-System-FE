import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FileService } from '../../service/file.service';
import { fileActions } from './file.actions';
import { SnackbarService } from '../../service/snackbar.service';
import { Store } from '@ngrx/store';
import { selectFileError } from './file.reducers';
import { Router } from '@angular/router';

export const getFileEffect = createEffect(
  (actions$ = inject(Actions), fileService = inject(FileService)) => {
    return actions$.pipe(
      ofType(fileActions.getFile),
      switchMap(({ id }) => {
        return fileService.fetchFile(id).pipe(
          map((file: Blob) => {
            return fileActions.getFileSuccess({ file });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(fileActions.getFileFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const openSnackbarErrorEffect = createEffect(
  (actions$ = inject(Actions), snackbarService = inject(SnackbarService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(fileActions.getFileFailure),
      tap(() => {
        store.select(selectFileError).subscribe(error => {
          snackbarService.openSnackBar('Fehler beim laden der Datei. \nError: ' + JSON.stringify(error));
        });
      })
    );
  },
  { functional: true, dispatch: false }
);

export const redirectAfterSuccessEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(fileActions.getFileSuccess),
      tap(() => {
        router.navigateByUrl('/web-view');
      })
    );
  },
  { functional: true, dispatch: false }
);
