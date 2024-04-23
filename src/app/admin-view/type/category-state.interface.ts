import { CategoryResponseInterface } from './category-response.interface';
import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';

export interface CategoryStateInterface {
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: CategoryResponseInterface[];
}
