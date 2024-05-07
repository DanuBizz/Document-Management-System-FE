import { CategoryResponseInterface } from './category-response.interface';
import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { NewPaginationQueryParamsInterface } from '../../shared/type/new-pagination-query-params.interface';

export interface CategoryStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: CategoryResponseInterface[];
  totalElements: string;
  pageSizeOptions: number[];
  pagination: NewPaginationQueryParamsInterface;
}
