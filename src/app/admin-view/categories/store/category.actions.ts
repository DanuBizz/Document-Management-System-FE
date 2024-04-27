import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';

export const categoryActions = createActionGroup({
  source: 'category',
  events: {
    'get all categories': emptyProps(),
    'get all categories success': props<{ category: CategoryResponseInterface[] }>(),
    'get all categories failure': props<{ error: BackendErrorsInterface }>(),

    'get categories with query': props<{ queryParams: PaginationQueryParamsInterface }>(),
    'get categories with query success': props<{ categories: CategoryResponseInterface[]; totalElements: string }>(),
    'get categories with query failure': props<{ error: BackendErrorsInterface }>(),
  },
});
