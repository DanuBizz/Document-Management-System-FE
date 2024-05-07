import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { DocumentVersionsResponseInterface } from './document-versions-response.interface';
import { NewPaginationQueryParamsInterface } from '../../shared/type/new-pagination-query-params.interface';

export interface DocumentStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: DocumentVersionsResponseInterface[];
  totalElements: string;
  pageSizeOptions: number[];
  pagination: NewPaginationQueryParamsInterface;
}
