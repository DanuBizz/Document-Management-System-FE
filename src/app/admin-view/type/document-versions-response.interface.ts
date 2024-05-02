import { DocumentResponseInterface } from './document-response.interface';

export interface DocumentVersionsResponseInterface {
  id: number;
  documentName: string;
  filePath: string;
  timestamp: Date;
  categoryNames: string[];
  isRead: boolean;
  isLatest: boolean;
  isVisible: boolean;
  oldVersions: DocumentResponseInterface[];
}
