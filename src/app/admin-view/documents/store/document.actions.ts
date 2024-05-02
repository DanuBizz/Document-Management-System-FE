import { createActionGroup, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { DocumentRequestInterface } from '../../type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';

export const documentActions = createActionGroup({
  source: 'document',
  events: {
    'get documents with query': props<{ queryParams: PaginationQueryParamsInterface }>(),
    'get documents with query success': props<{
      documents: DocumentVersionsResponseInterface[];
      totalElements: string;
    }>(),
    'get documents with query failure': props<{ error: BackendErrorsInterface }>(),

    'create document version': props<{ doc: DocumentRequestInterface }>(),
    'create document version success': props<{ message: string }>(),
    'create document version failure': props<{ error: BackendErrorsInterface }>(),
  },
});
