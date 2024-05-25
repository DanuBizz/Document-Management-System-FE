import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { UserResponseInterface } from './user-response.interface';
import { PaginationQueryParamsInterface } from '../../shared/type/pagination-query-params.interface';

export interface UserStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  allData: UserResponseInterface[];
  tableData: UserResponseInterface[];
  totalElements: string;
  pagination: PaginationQueryParamsInterface;
  areLoaded: boolean;
}
