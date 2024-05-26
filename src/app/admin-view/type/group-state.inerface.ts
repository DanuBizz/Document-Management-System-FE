import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { PaginationQueryParamsInterface } from '../../shared/type/pagination-query-params.interface';
import { GroupResponseInterface } from './group-response-interface';

export interface GroupStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  tableData: GroupResponseInterface[];
  allData: GroupResponseInterface[];
  totalElements: string;
  pageSizeOptions: number[];
  queryParams: PaginationQueryParamsInterface;
  areLoaded: boolean;
}
