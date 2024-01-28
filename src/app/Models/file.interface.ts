// knowledge-base.model.ts

  export interface FileTable {
    fileId: number;
    fileName: string;
    filePath: string | null;
    fileContent: string | null;
  }
  