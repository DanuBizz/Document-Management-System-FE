import { BackendErrorsInterface } from '../../shared/type/backend-erros.interface';
import { DocumentResponseInterface } from './document-response.interface';

export interface DocumentStateInterface {
  isLoading: boolean;
  error: BackendErrorsInterface | null;
  data: DocumentResponseInterface[];
  totalElements: string;
}
