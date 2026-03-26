// src/app/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Iniezione del nostro servizio
  const authService = inject(AuthService);
  const token = authService.getToken(); // Prendiamo il token dal localStorage

  // Se abbiamo un token, cloniamo la richiesta originale e le appiccichiamo il "Pass VIP"
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Facciamo proseguire la richiesta modificata verso il backend
    return next(authReq);
  }

  // Se non siamo loggati (niente token), facciamo passare la richiesta così com'è
  return next(req);
};
