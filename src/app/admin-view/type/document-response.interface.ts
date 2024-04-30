export interface DocumentResponseInterface {
  id: number;
  documentName: string;
  filePath: string;
  timestamp: Date;
  categoryNames: string[];
  isRead: boolean;
  isLatest: boolean;
  isVisible: boolean;
}
