import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';

export const categoryActions = createActionGroup({
  source: 'category',
  events: {
    'get all categories': emptyProps(),
    'get all categories success': props<{ category: CategoryResponseInterface[] }>(),
    'get all categories failure': props<{ error: BackendErrorsInterface }>(),
  },
});

/*

export const getCategories = createAction('[Category Management] Get categories from backend');
export const setCategories = createAction('[Category Management] Set categories', props<{ categories: CategoryInterface[] }>());

*/
