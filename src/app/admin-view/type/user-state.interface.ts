import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { UserResponseInterface } from './user-response.interface';
import { QueryParamsInterface } from '../../shared/type/query-params.interface';

export interface UserStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  allData: UserResponseInterface[];
  tableData: UserResponseInterface[];
  totalElements: string;
  queryParams: QueryParamsInterface;
  areLoaded: boolean;
}
