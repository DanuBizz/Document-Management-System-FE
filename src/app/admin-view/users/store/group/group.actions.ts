import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaginationQueryParamsInterface } from '../../../../shared/type/pagination-query-params.interface';
import { BackendErrorsInterface } from '../../../../shared/type/backend-erros.interface';
import { GroupResponseInterface } from '../../../type/group-response-interface';
import { GroupRequestInterface } from '../../../type/group-request.interface';

export const groupActions = createActionGroup({
  source: 'group',
  events: {
    'get all groups': emptyProps(),
    'get all groups success': props<{ groups: GroupResponseInterface[] }>(),
    'get all groups failure': props<{ error: BackendErrorsInterface }>(),

    'get groups with query': props<{ pagination: PaginationQueryParamsInterface }>(),
    'get groups with query success': props<{ groups: GroupResponseInterface[]; totalElements: string }>(),
    'get groups with query failure': props<{ error: BackendErrorsInterface }>(),

    'create group': props<{ group: GroupRequestInterface }>(),
    'create group success': props<{ message: string }>(),
    'create group failure': props<{ error: BackendErrorsInterface }>(),

    'change group users': props<{ id: number; isAdmin: boolean }>(),
    'change group users success': props<{ message: string }>(),
    'change group users failure': props<{ error: BackendErrorsInterface }>(),
  },
});
