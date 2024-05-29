import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { authActions } from './auth.actions';
import { combineLatest, delay, map, of, switchMap, takeWhile } from 'rxjs';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PersistenceService } from '../service/persistence.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/service/notification.service';
import { documentActions } from '../../admin-view/documents/store/document.actions';
import { Store } from '@ngrx/store';
import {
  selectDocumentAreLoaded,
  selectDocumentTotalElements,
} from '../../admin-view/documents/store/document.reducers';

/**
 * Effect that handles the login action. It sends a login request to the AuthService,
 * stores the access token in local storage upon successful login, and dispatches
 * loginSuccess action. If login fails, it dispatches loginFailure action.
 */
export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), persistenceService = inject(PersistenceService)) => {
    return actions$.pipe(
      ofType(authActions.login),
      switchMap(({ request }) => {
        const encodedUsername = btoa(request.user.username);
        persistenceService.set('accessToken', btoa(request.user.username + ':' + request.user.password));
        return authService.getCsrfToken().pipe(
                switchMap(() => {
                  return authService.getCurrentUser(encodedUsername).pipe(
                    map((currentUser: CurrentUserInterface) => {
                      return authActions.loginSuccess({ currentUser });
                    }),
                    catchError((errorResponse: HttpErrorResponse) => {
                      return of(authActions.loginFailure({ errors: errorResponse.error.errors }));
                    })
                  );
                })
              );
            })
          );
        },
  { functional: true }
);

/**
 * Effect that redirects the user after successful login.
 */
export const redirectAfterLoginEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), store = inject(Store)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(({ currentUser }) => {
        if (currentUser.isAdmin) {
          router.navigateByUrl('/admin/document');
        } else {
          store.dispatch(documentActions.getUnreadUserDocuments());
          const data$ = combineLatest({
            totalElements: store.select(selectDocumentTotalElements),
            areLoaded: store.select(selectDocumentAreLoaded),
          });

          data$.pipe(takeWhile(data => !data.areLoaded, true)).subscribe(data => {
            if (data.areLoaded) {
              if (data.totalElements === '0') {
                router.navigateByUrl('user/documents-overview');
              } else {
                router.navigateByUrl('user/confirm-new-documents');
              }
            }
          });
        }
      })
    );
  },
  { functional: true, dispatch: false }
);

/**
 * Effect that retrieves the current user's information. It sends a request to
 * the AuthService to get the current user's details. If the access token is not
 * found in local storage, it dispatches getCurrentUserFailure action. If an error
 * occurs during the request, it also dispatches getCurrentUserFailure action.
 */
export const getCurrentUserEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), persistenceService = inject(PersistenceService)) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const encodedToken = persistenceService.get('accessToken') as string;
        if (!encodedToken) {
          return of(authActions.getCurrentUserFailure());
        }
        const decodedToken = atob(encodedToken);
        const [username] = decodedToken.split(':');
        const encodedUsername = btoa(username);

        return authService.getCurrentUser(encodedUsername).pipe(
          map((currentUser: CurrentUserInterface) => {
            return authActions.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => of(authActions.getCurrentUserFailure()))
        );
      })
    );
  },
  { functional: true }
);

/**
 * Effect that handles the logout action. It removes the login-credentials from local storage
 */
export const logoutEffect = createEffect(
  () => {
    const actions$ = inject(Actions);
    const authService = inject(AuthService);
    return actions$.pipe(
      ofType(authActions.logout),
      switchMap(() => {
        return authService.logout().pipe(
          switchMap(() => of(authActions.logoutSuccess())),
          catchError(() => of(authActions.logoutFailure()))
        );
      })
    );
  },
  { functional: true }
);

/**
 * Effect that redirects the user after logout.
 */
export const redirectAfterLogoutEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.logoutSuccess, authActions.logoutFailure),
      delay(10),
      tap(() => {
        router.navigateByUrl('/login');
      })
    );
  },
  { functional: true, dispatch: false }
);

/**
 * Effect for opening a notification if a logout has succeeded
 */
export const openNotificationSuccessLogout = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess, authActions.logoutSuccess),
      tap(action$ => {
        notificationService.pushNotification(`${action$.type}`, false);
      })
    );
  },
  { functional: true, dispatch: false }
);

/**
 * Effect for opening a notification if a logout has failed
 */
export const openNotificationFailureLogout = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(authActions.loginFailure, authActions.logoutFailure),
      tap(action$ => {
        notificationService.pushNotification(`${action$.type}`, true);
      })
    );
  },
  { functional: true, dispatch: false }
);
