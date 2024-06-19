import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaginationConfigService {
  // The initialPageIndex represents the initial page index.
  private initialPageIndex: string = '0';

  // The pageSizeOptions contain the available options for page size.
  private pageSizeOptions: number[] = environment.pageSizeOptions;

  // The pageSize represents the current value of the pageSizeOptions.
  private pageSize: number = this.pageSizeOptions[0];

  private sort: string = '';

  getPageSizeOptions(): number[] {
    return this.pageSizeOptions;
  }

  getInitialPageIndex(): string {
    return this.initialPageIndex;
  }

  getInitialPageSize(): string {
    return this.pageSize.toString();
  }

  getInitialSort(): string {
    return this.sort;
  }

  setPageSize(value: number): void {
    this.pageSize = value;
  }
}
