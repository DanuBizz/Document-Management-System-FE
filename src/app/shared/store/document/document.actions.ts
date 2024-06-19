import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../type/backend-erros.interface';
import { DocumentRequestInterface } from '../../../admin-view/type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../../admin-view/type/document-versions-response.interface';
import { QueryParamsInterface } from '../../type/query-params.interface';

export const documentActions = createActionGroup({
  source: 'document',
  events: {
    'get documents with query': props<{ queryParams: QueryParamsInterface }>(),
    'get documents with query success': props<{
      documents: DocumentVersionsResponseInterface[];
      totalElements: string;
    }>(),
    'get documents with query failure': props<{ error: BackendErrorsInterface }>(),

    'get user documents with query': props<{ queryParams: QueryParamsInterface }>(),
    'get user documents with query success': props<{
      documents: DocumentVersionsResponseInterface[];
      totalElements: string;
    }>(),
    'get user documents with query failure': props<{ error: BackendErrorsInterface }>(),

    'get unread user documents': emptyProps(),
    'get unread user documents success': props<{
      documents: DocumentVersionsResponseInterface[];
      totalElements: string;
    }>(),
    'get unread user documents failure': props<{ error: BackendErrorsInterface }>(),

    'create document version': props<{ doc: DocumentRequestInterface }>(),
    'create document version success': props<{ emailSent: boolean }>(),
    'create document version failure': props<{ error: BackendErrorsInterface }>(),

    'change document visibility': props<{ id: number }>(),
    'change document visibility success': emptyProps(),
    'change document visibility failure': props<{ error: BackendErrorsInterface }>(),

    'confirm document': props<{ id: number; docId: number }>(),
    'confirm document success': emptyProps(),
    'confirm document failure': props<{ error: BackendErrorsInterface }>(),
  },
});
