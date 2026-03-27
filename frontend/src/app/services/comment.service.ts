import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/cats';

  getCommentsByCatId(catId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${catId}/comments`);
  }

  addComment(catId: number, content: string): Observable<Comment> {
    // Invia un oggetto con il campo "content"
    return this.http.post<Comment>(`${this.apiUrl}/${catId}/comments`, { content });
  }
}
