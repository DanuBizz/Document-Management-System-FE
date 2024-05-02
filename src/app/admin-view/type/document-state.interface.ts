import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { PaginationQueryParamsInterface } from '../../shared/type/pagination-query-params.interface';
import { DocumentVersionsResponseInterface } from './document-versions-response.interface';

export interface DocumentStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: DocumentVersionsResponseInterface[];
  totalElements: string;
  queryParams: PaginationQueryParamsInterface;
}
