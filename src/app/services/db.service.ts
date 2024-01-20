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
  getQueries(): Observable<knowledgeBase[]> {
    return this.http.get<knowledgeBase[]>('https://localhost:7282/api/KnowledgeBase/GetAllData')//.toPromise();
  }
  getQueryById(id: number): Observable<knowledgeBase> {
    return this.http.get<knowledgeBase>(`https://localhost:7282/api/KnowledgeBase/GetById/${id}`);
  }
  insertData(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(`${this.apiUrl}/PostQuery`, data, { headers });
  }
  


  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
  //  // HTTP POST request example
  //  postData(data: any): Observable<any> {
  //   const url = `${this.apiUrl}/messages`;
  //   return this.http.post(url, data);
  // }

  // // HTTP GET request example
  // getData(): Observable<any> {
  //   const url = `${this.apiUrl}/messages`;
  //   return this.http.get(url);
  // }
}
