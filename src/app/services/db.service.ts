import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

export interface knowledgeBase {
  id: number,
  question: string,
  answer: string,
  description: string
}

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private apiUrl = 'https://localhost:7282/api/KnowledgeBase';
  constructor(private http: HttpClient,private messageService: MessageService) { }

  //getting all queries for auto suggest
  getQueries(): Observable<knowledgeBase[]> {
    return this.http.get<knowledgeBase[]>(`${this.apiUrl}/GetAllData`)//.toPromise();
  }
  // getQueryById(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/GetById/${id}`);
  // }

  //getting a query and its related files by id
  getQueryAndFilesById(id:number){
    return this.http.get<any>(`${this.apiUrl}/GetQueryAndFilesById/${id}`);

  }

  //Data insertion to DB  ***********as of now inserting only knowledge base
  insertData(data: any) : Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<number>(`${this.apiUrl}/PostQuery`, data, { headers });
  }
  
  //uploading files 
  uploadFile(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }

  //send / upload files with queryId
  sendFile(file: File, queryId:number) {
    const formData = this.uploadFile(file);
    return this.http.post(`${this.apiUrl}/UploadFile?queryId=${queryId}`, formData);
  }

//downloading file
  downloadFile(fileId: number): Observable<Blob> {
    const url = `${this.apiUrl}/GetFileById/${fileId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

//Alert messages
  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  
}
