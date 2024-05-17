import { BackendErrorsInterface } from './backend-erros.interface';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface FileStateInterface {
  data: SafeResourceUrl | null;
  error: BackendErrorsInterface | null;
  isLoading: boolean;
}
