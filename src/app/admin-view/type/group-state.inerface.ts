import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { GroupResponseInterface } from './group-response-interface';
import { QueryParamsInterface } from '../../shared/type/query-params.interface';

export interface GroupStateInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  tableData: GroupResponseInterface[];
  allData: GroupResponseInterface[];
  totalElements: string;
  pageSizeOptions: number[];
  queryParams: QueryParamsInterface;
  areLoaded: boolean;
}
