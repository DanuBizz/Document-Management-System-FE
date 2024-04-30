import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { DocumentResponseInterface } from './document-response.interface';
import { PaginationQueryParamsInterface } from '../../shared/type/pagination-query-params.interface';

export interface DocumentStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: DocumentResponseInterface[];
  totalElements: string;
  queryParams: PaginationQueryParamsInterface;
}
