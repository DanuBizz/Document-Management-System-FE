import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationConfigService {
  // The initialPageIndex represents the initial page index.
  private initialPageIndex: string = '0';

  // The pageSizeOptions contain the available options for page size.
  private pageSizeOptions: number[] = [3, 5, 10, 25];

  // The pageSize represents the current value of the pageSizeOptions.
  private pageSize: number = this.pageSizeOptions[1];

  getPageSizeOptions(): number[] {
    return this.pageSizeOptions;
  }

  getInitialPageIndex(): string {
    return this.initialPageIndex;
  }

  getPageSize(): string {
    return this.pageSize.toString();
  }

  setPageSize(value: number): void {
    this.pageSize = value;
  }
}
