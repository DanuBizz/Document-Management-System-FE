import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';

export const documentActions = createActionGroup({
  source: 'document',
  events: {
    'get documents': emptyProps(),
    'get documents success': props<{ document: DocumentResponseInterface[] }>(),
    'get documents failure': props<{ error: BackendErrorsInterface }>(),
  },
});
