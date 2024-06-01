import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap, take } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { documentActions } from './document.actions';
import { Store } from '@ngrx/store';
import { selectDocumentQueryParams } from './document.reducers';
import { DocumentService } from '../../../shared/service/document.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { PersistenceService } from '../../../auth/service/persistence.service';

export const getDocumentsWithQuery = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getDocumentsWithQuery),
      switchMap(({ queryParams }) => {
        // Calling the service method to fetch documents
        return documentService.fetchDocumentsWithAssociatedVersionsWithQuery(queryParams).pipe(
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

export const getUserDocumentsWithQuery = createEffect(
  // Injecting dependencies
  (
    actions$ = inject(Actions),
    documentService = inject(DocumentService),
    persistenceService = inject(PersistenceService)
  ) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getUserDocumentsWithQuery),
      switchMap(({ queryParams }) => {
        const encodedToken = persistenceService.get('accessToken') as string;
        const decodedToken = atob(encodedToken);
        const username = decodedToken.split(':');

        return documentService.fetchUserDocumentsWithAssociatedVersionsWithQuery(queryParams, username[0]).pipe(
          map(documents =>
            // Handling the response and dispatching action when successful
            documentActions.getUserDocumentsWithQuerySuccess({
              documents: documents.documents,
              totalElements: documents.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.getUserDocumentsWithQueryFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const getUnreadUserDocuments = createEffect(
  // Injecting dependencies
  (
    actions$ = inject(Actions),
    documentService = inject(DocumentService),
    persistenceService = inject(PersistenceService)
  ) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.getUnreadUserDocuments),
      switchMap(() => {
        const encodedToken = persistenceService.get('accessToken') as string;
        const decodedToken = atob(encodedToken);
        const username = decodedToken.split(':');

        return documentService.fetchUnreadUserDocuments(username[0]).pipe(
          map(documents =>
            // Handling the response and dispatching action when successful
            documentActions.getUnreadUserDocumentsSuccess({
              documents: documents.documents,
              totalElements: documents.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.getUnreadUserDocumentsFailure(errorResponse.error));
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
          map(({ emailSent }) =>
            // Handling the response and dispatching action when successful
            documentActions.createDocumentVersionSuccess({ emailSent })
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
          map(() =>
            // Handling the response and dispatching action when successful
            documentActions.changeDocumentVisibilitySuccess()
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

export const confirmDocumentEffect = createEffect(
  // Injecting dependencies
  (actions$ = inject(Actions), documentService = inject(DocumentService)) => {
    return actions$.pipe(
      // Listening for actions of type
      ofType(documentActions.confirmDocument),
      switchMap(({ id, docId }) => {
        // Calling the service method to create document
        return documentService.confirmDocument(id, docId).pipe(
          map(() =>
            // Handling the response and dispatching action when successful
            documentActions.confirmDocumentSuccess()
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            // Handling errors and dispatching action when fetching fails
            return of(documentActions.confirmDocumentFailure(errorResponse.error));
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
        return store.select(selectDocumentQueryParams).pipe(
          take(1),
          map(queryParams => documentActions.getDocumentsWithQuery({ queryParams: queryParams }))
        );
      })
    );
  },
  { functional: true, dispatch: true }
);

/**
 * Effect for opening a notification if a document is created
 * It receives a boolean if email has succesfully sent or not and displays the result
 */
export const openNotificationEmailSent = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(documentActions.createDocumentVersionSuccess),
      tap(({ emailSent }) => {
        if (emailSent) {
          notificationService.pushNotification(`Email erfolgreich gesendet`, false);
        } else {
          notificationService.pushNotification(`Email senden fehlgeschlagen`, true);
        }
      })
    );
  },
  { functional: true, dispatch: false }
);
