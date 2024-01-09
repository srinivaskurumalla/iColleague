import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface knowledgeBase {
  id: number,
  question: string,
  answer: string,
  description:string
}

@Injectable({
  providedIn: 'root'
})

export class DbService {

  private apiUrl = 'http://localhost:3978/api';
  constructor(private http: HttpClient) { }
  getQueries(): Observable<knowledgeBase[]> {
    return this.http.get<knowledgeBase[]>(' http://localhost:3000/knowledgeBase')//.toPromise();
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
