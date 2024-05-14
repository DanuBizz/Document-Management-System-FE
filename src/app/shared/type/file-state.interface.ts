import { BackendErrorsInterface } from './backend-erros.interface';

export interface FileStateInterface {
  data: Blob | null;
  error: BackendErrorsInterface | null;
  isLoading: boolean;
}
