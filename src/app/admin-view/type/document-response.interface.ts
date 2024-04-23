export interface DocumentResponseInterface {
  id: number;
  name: string;
  filePath: string;
  categoryIds: number[];
  read: boolean;
  visible: boolean;
}
