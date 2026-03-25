import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
//moduli importati per i form
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
selector: 'app-register',
standalone: true,
imports: [CommonModule, ReactiveFormsModule, RouterModule],
templateUrl: './register.component.html',
styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit { // Implementata l'interfaccia OnInit
  registerForm!: FormGroup;
  errorMessage: string = '';
  isLoading = false;


constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
) {
// costruzione della struttura del modulo
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
}
ngOnInit() {
    // Questa funzione "ascolta" ogni singola digitazione in qualsiasi campo del form
    this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }
//per leggere velocemente i campi nell'html
get f() { return this.registerForm.controls; }



onSubmit(){
  //se l'utente oltrepassa i controlli html
  if(this.registerForm.invalid) {
     this.registerForm.markAllAsTouched(); // evidenzia i campi errati
      return;
  }
  //svuoto l'errore precedente
  this.errorMessage = '';
  this.isLoading = true; // mostra un indicatore di caricamento se necessario

  //si prendono i dati puliti e validati dal form
  const userData = this.registerForm.value;

  this.authService.register(userData).subscribe({
    next: (res) => {
      console.log('Registrazione completata!', res);
        this.isLoading = false; // nascondi l'indicatore di caricamento
      //token già salvato nel service.
      //l'utente torna alla home
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Errore durante la registrazione', err);
        this.isLoading = false; // nascondi l'indicatore di caricamento, c'è un errore
      //mostro l'errore che arriva dal node.js
      this.errorMessage = err.error?.error|| 'Errore di connessione al server.';
    }
  });
}

}
