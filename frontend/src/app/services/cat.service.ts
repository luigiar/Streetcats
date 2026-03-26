import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from '../models/cat.model';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'http://localhost:3000/api/cats';

  constructor(private http: HttpClient) { }

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.apiUrl);
  }

  //l'interceptor passa il token qui, non lo aggiugo manualmente
    addCat(catData: any): Observable<Cat> {
    return this.http.post<Cat>(this.apiUrl, catData);
  }
}
