import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { GroupResponseInterface } from '../../type/group-response-interface';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';

export const groupActions = createActionGroup({
  source: 'group',
  events: {
    'get all groups': emptyProps(),
    'get all groups success': props<{ groups: GroupResponseInterface[] }>(),
    'get all groups failure': props<{ error: BackendErrorsInterface }>(),

    'get groups with query': props<{ queryParams: QueryParamsInterface }>(),
    'get groups with query success': props<{ groups: GroupResponseInterface[]; totalElements: string }>(),
    'get groups with query failure': props<{ error: BackendErrorsInterface }>(),

    'create group': props<{ group: string }>(),
    'create group success': emptyProps(),
    'create group failure': props<{ error: BackendErrorsInterface }>(),
  },
});
