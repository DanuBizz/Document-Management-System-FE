import { CategoryResponseInterface } from './category-response.interface';
import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { QueryParamsInterface } from '../../shared/type/query-params.interface';

export interface CategoryStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  tableData: CategoryResponseInterface[];
  allData: CategoryResponseInterface[];
  totalElements: string;
  pageSizeOptions: number[];
  queryParams: QueryParamsInterface;
  areLoaded: boolean;
}
