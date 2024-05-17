import {createActionGroup, props} from '@ngrx/store';
import {BackendErrorsInterface} from '../../type/backend-erros.interface';
import {SafeResourceUrl} from '@angular/platform-browser';

export const fileActions = createActionGroup({
  source: 'file',
  events: {
    'get file': props<{ id: number }>(),
    'get file success': props<{ fileUrl: SafeResourceUrl }>(),
    'get file failure': props<{ error: BackendErrorsInterface }>(),
  },
});
