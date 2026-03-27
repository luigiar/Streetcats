import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Il Signal che contiene il testo del messaggio (se è vuoto, il pop-up è nascosto)
  message = signal<string>('');

  // Il Signal per il tipo di messaggio ('success' = verde, 'error' = rosso)
  type = signal<'success' | 'error'>('success');

  show(text: string, msgType: 'success' | 'error' = 'success') {
    this.message.set(text);
    this.type.set(msgType);

    //  dopo 3000 millisecondi svuota il messaggio
    setTimeout(() => {
      this.message.set('');
    }, 3000);
  }
}
