import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false; //indicatore di caricamento

  //iniezione dipendenze
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  constructor() {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

ngOnInit() {
    // Ascolta ogni digitazione nel form per rimuovere il messaggio d'errore globale
    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  //get nell'html per accedere ai controlli del form
  get f(){return this.loginForm.controls;}



  onSubmit() {
    if(this.loginForm.invalid){
    this.loginForm.markAllAsTouched(); // evidenzia i campi non validi
    return;
    }
    //reeset del messaggio d'errore ad ogni submit per evitare di mostrare errori
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
    next:(res) => {
    console.log('✅Login effettuato!', res);
    this.isLoading = false;
   this.router.navigate(['/']);
   this.notificationService.show('Login effettuato con successo!', 'success');
    },
    error:(err) => {
   console.error('❌ Errore di login', err);
    this.isLoading = false;
   //se l'utente sbaglia password manda un messaggio di errore
   this.errorMessage = err.error?.message || 'Credenziali non valide o errore di rete.';
   }
});
  }
}
