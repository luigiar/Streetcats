import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from '../models/cat.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CatService {
private apiUrl = `${environment.apiUrl}/cats`;

  constructor(private http: HttpClient) { }

//sfrutto i Generics, il metodo restituisce un Observable di un array di Cat
  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.apiUrl);
  }

  //l'interceptor passa il token qui, non lo aggiugo manualmente
    addCat(catData: any): Observable<Cat> {
    return this.http.post<Cat>(this.apiUrl, catData);
  }
}
