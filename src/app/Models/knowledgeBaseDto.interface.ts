import { FileTable } from "./file.interface";

export interface KnowledgeBaseDto {
    id: number;
    question: string;
    answer: string;
    description: string;
    fileTables: FileTable[];
  }
  