import { BackendErrorsInterface } from './backend-erros.interface';

export interface FileStateInterface {
  data: File[];
  error: BackendErrorsInterface | null;
  isLoading: boolean;
}
