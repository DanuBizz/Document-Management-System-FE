import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { UserResponseInterface } from './user-response.interface';

export interface UserStateInterface {
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: UserResponseInterface[];
  totalElements: string;
}
