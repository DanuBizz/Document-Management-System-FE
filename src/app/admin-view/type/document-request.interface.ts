import { CategoryResponseInterface } from './category-response.interface';

export interface DocumentRequestInterface {
  file: File;
  name: string;
  categories: CategoryResponseInterface[];
  timestamp: Date;
}
