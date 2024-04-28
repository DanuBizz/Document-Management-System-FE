import { CategoryResponseInterface } from './category-response.interface';

export interface DocVersionRequest {
  file: File;
  name: string;
  categories: CategoryResponseInterface[];
  timestamp: Date;
}
