import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FileService } from '../../service/file.service';
import { fileActions } from './file.actions';

export const getFileEffect = createEffect(
  (actions$ = inject(Actions), fileService = inject(FileService)) => {
    return actions$.pipe(
      ofType(fileActions.getFile),
      switchMap(({ id }) => {
        return fileService.fetchFile(id).pipe(
          map((file: Blob) => {
            const fileUrl = fileService.getFileUrl(file);
            return fileActions.getFileSuccess({ fileUrl });
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
