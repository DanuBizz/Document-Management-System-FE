import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { CategoryRequestInterface } from '../../type/category-request.interface';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';

export const categoryActions = createActionGroup({
  source: 'category',
  events: {
    'get all categories': emptyProps(),
    'get all categories success': props<{ category: CategoryResponseInterface[] }>(),
    'get all categories failure': props<{ error: BackendErrorsInterface }>(),

    'get categories with query': props<{ queryParams: QueryParamsInterface }>(),
    'get categories with query success': props<{ categories: CategoryResponseInterface[]; totalElements: string }>(),
    'get categories with query failure': props<{ error: BackendErrorsInterface }>(),

    'create category': props<{ category: CategoryRequestInterface }>(),
    'create category success': props<{ message: string }>(),
    'create category failure': props<{ error: BackendErrorsInterface }>(),

    'update category': props<{ id: number; category: CategoryRequestInterface }>(),
    'update category success': props<{ message: string }>(),
    'update category failure': props<{ error: BackendErrorsInterface }>(),
  },
});
