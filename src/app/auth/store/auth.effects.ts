import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";
import {authActions} from "./auth.actions";
import {map, of, switchMap} from "rxjs";
import {CurrentUserInterface} from "../../shared/type/current-user.interface";
import {catchError, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {PersistanceService} from "../service/persistance.service";
import {Router} from "@angular/router";


export const loginEffect = createEffect((
    actions$ = inject(Actions),
    authService = inject(AuthService),
    persistanceService = inject(PersistanceService),
) => {
    return actions$.pipe(
        ofType(authActions.login),
        switchMap(({request}) => {
            return authService.login(request).pipe(
                map((currentUser: CurrentUserInterface) => {
                    persistanceService.set('accessToken', currentUser.token)
                    return authActions.loginSuccess({currentUser})
                }),
                catchError((errorResponse: HttpErrorResponse) => {
                    return of(authActions.loginFailure({errors: errorResponse.error.errors}));
                })
            )
        })
    )
}, {functional: true})

export const redirectAfterLoginEffect = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
        return actions$.pipe(
            ofType(authActions.loginSuccess),
            tap(() => {
                router.navigateByUrl('/admin/document')
            })
        )
    }, {functional: true, dispatch: false}
)

export const getCurrentUserEffect = createEffect((
    actions$ = inject(Actions),
    authService = inject(AuthService),
    persistanceService = inject(PersistanceService),
) => {
    return actions$.pipe(
        ofType(authActions.getCurrentUser),
        switchMap(() => {
            const token = persistanceService.get('accessToken');
            if(!token) {
                return of(authActions.getCurrentUserFailure());
            }
            return authService.getCurrentUser().pipe(
                map((currentUser: CurrentUserInterface) => {
                    return authActions.getCurrentUserSuccess({currentUser})
                }),
                catchError(() => {
                    return of(authActions.getCurrentUserFailure());
                })
            )
        })
    )
}, {functional: true})

