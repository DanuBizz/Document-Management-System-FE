import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { LoginRequestInterface } from '../type/login-request.interface';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    Login: props<{ request: LoginRequestInterface }>(),
    'Login Success': props<{ currentUser: CurrentUserInterface }>(),
    'Login Failure': props<{ errors: BackendErrorsInterface }>(),

    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ currentUser: CurrentUserInterface }>(),
    'Get Current User Failure': emptyProps(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': emptyProps(),
  },
});
