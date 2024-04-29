import { CategoryResponseInterface } from './category-response.interface';
import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import {PaginationQueryParamsInterface} from "../../shared/type/pagination-query-params.interface";

export interface CategoryStateInterface {
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: CategoryResponseInterface[];
  totalElements: string;
  queryParams: PaginationQueryParamsInterface;
}
