import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { UserResponseInterface } from '../../type/user-response.interface';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';

export const userActions = createActionGroup({
  source: 'user',
  events: {
    'get all users': emptyProps(),
    'get all users success': props<{ user: UserResponseInterface[] }>(),
    'get all users failure': props<{ error: BackendErrorsInterface }>(),

    'get users with query': props<{ queryParams: QueryParamsInterface }>(),
    'get users with query success': props<{ users: UserResponseInterface[]; totalElements: string }>(),
    'get users with query failure': props<{ error: BackendErrorsInterface }>(),

    'change user role': props<{ id: number; isAdmin: boolean }>(),
    'change user role success':  emptyProps(),
    'change user role failure': props<{ error: BackendErrorsInterface }>(),

    'change user groups': props<{ id: number; groupIds: number[] }>(),
    'change user groups success': emptyProps(),
    'change user groups failure': props<{ error: BackendErrorsInterface }>(),
  },
});
