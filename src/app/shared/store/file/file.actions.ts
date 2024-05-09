import { createActionGroup, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../type/backend-erros.interface';

export const fileActions = createActionGroup({
  source: 'file',
  events: {
    'get file': props<{ id: number }>(),
    'get file success': props<{ file: File[] }>(),
    'get file failure': props<{ error: BackendErrorsInterface }>(),
  },
});
