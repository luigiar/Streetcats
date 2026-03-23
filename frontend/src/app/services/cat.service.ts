import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatService {

  private apiUrl = 'http://localhost:3000/api/cats';

  constructor(private http: HttpClient) { }

  getCats(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
