import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

//classe signleton, una unica istanza per tutta l'app, gestisce autenticazione e stato utente
//decoratore di confiugrazione del servizio, disponibile in tutta l'app
@Injectable({
providedIn: 'root'
})

export class AuthService {
private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'streetcats_jwt';

  //signal : mantiene lo stato dell'utente. Se null, non è loggato
  currentUser: WritableSignal<User | null> = signal(null);

  constructor(private http: HttpClient){
    this.checkInitialAuth();
  }

  //controlla se c'è già un token valido all'avvio dell'app
  private checkInitialAuth(){
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem('streetcats_user');

    if(token && userJson){
      this.currentUser.set(JSON.parse(userJson));
    }
  }



  //chiamata  di registrazione
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.handleAuthentication(res))
    );
  }



  // chiamata di login
  login(credentials: any): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthentication(res)) //tap permette di fare cose extra quando arriva la risposta
    );
  }


  //logout
  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('streetcats_user');
    this.currentUser.set(null); //signal avvisa tutti che c'è stato il logout
  }

  //salva i dati in modo sicuro
  private handleAuthentication(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem('streetcats_user', JSON.stringify(res.user));
    this.currentUser.set(res.user); //aggiornamento dei signal
  }

  //metodo per recuperare il token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
