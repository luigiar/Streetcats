import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Comment } from '../../models/comment.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css'
})
export class CommentSectionComponent implements OnInit {
  //  INPUT: L'ID del gatto passato dal padre, questo componente non puo esistere se il padre non gli passa un catId valido
  catId = input.required<number>();

  // La lista dei commenti che aggiornata reattivamente tramite i signal
  comments = signal<Comment[]>([]);

  // DIPENDENZE E FORM, utilizzo dei reactive form per gestire il form dei commenti, e inietto i servizi necessari
  private commentService = inject(CommentService);
  authService = inject(AuthService); // Pubblico così l'HTML può leggere il currentUser()
  private fb = inject(FormBuilder);

  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // Appena il componente nasce, scarica i commenti
  ngOnInit() {
    this.caricaCommenti();
  }

  caricaCommenti() {
    this.commentService.getCommentsByCatId(this.catId()).subscribe({
      next: (data) => this.comments.set(data),
      error: (err) => console.error('Errore nel caricamento commenti:', err)
    });
  }

inviaCommento() {
    if (this.commentForm.invalid) return;

   // il testo scritto dall'utente
    const testoSemplice = this.commentForm.value.content;

    console.log(` Invio commento per il gatto #${this.catId()}: "${testoSemplice}"`);

    this.commentService.addComment(this.catId(), testoSemplice).subscribe({
      next: (nuovoCommentoConfermatoDALServer) => {
        console.log(' Commento salvato nel DB!', nuovoCommentoConfermatoDALServer);

        this.caricaCommenti();

        //Reset del campo di testo
        this.commentForm.reset();
      },
      error: (err) => {
        console.error('❌ Errore invio commento:', err);
        alert('Errore durante la pubblicazione del commento');
      }
    });
  }}
