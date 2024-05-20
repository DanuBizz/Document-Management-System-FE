import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { authActions } from './auth.actions';
import { map, of, switchMap } from 'rxjs';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PersistenceService } from '../service/persistence.service';
import { Router } from '@angular/router';
import { AuthResponseInterface } from '../type/auth-response.interface';

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
        persistenceService.set('accessToken', btoa((request.user.username + ':' + request.user.password)));
        return authService.login(request).pipe(
          map((response: CurrentUserInterface) => {
            getCurrentUserEffect();
            return authActions.loginSuccess({ currentUser: response });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(authActions.loginFailure({ errors: errorResponse.error.errors }));
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
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(({ currentUser }) => {
        if (currentUser.isAdmin) {
          router.navigateByUrl('/admin/document');
        } else {
          router.navigateByUrl('/user/document');
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
  (actions$ = inject(Actions), authService = inject(AuthService), persistanceService = inject(PersistenceService)) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const token = persistanceService.get('accessToken');
        if (!token) {
          return of(authActions.getCurrentUserFailure());
        }
        return authService.getCurrentUser().pipe(
          map((currentUser: CurrentUserInterface) => {
            return authActions.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => {
            return of(authActions.getCurrentUserFailure());
          })
        );
      })
    );
  },
  { functional: true }
);
