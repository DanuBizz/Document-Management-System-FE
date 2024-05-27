import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { DocumentRequestInterface } from '../../type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';

export const documentActions = createActionGroup({
  source: 'document-admin',
  events: {
    'get documents with query': props<{ queryParams: QueryParamsInterface }>(),
    'get documents with query success': props<{
      documents: DocumentVersionsResponseInterface[];
      totalElements: string;
    }>(),
    'get documents with query failure': props<{ error: BackendErrorsInterface }>(),

    'create document version': props<{ doc: DocumentRequestInterface }>(),
    'create document version success': props<{ emailSent: boolean }>(),
    'create document version failure': props<{ error: BackendErrorsInterface }>(),

    'change document visibility': props<{ id: number }>(),
    'change document visibility success': emptyProps(),
    'change document visibility failure': props<{ error: BackendErrorsInterface }>(),
  },
});
