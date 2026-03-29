import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css']
})
export class WelcomeModalComponent implements OnInit {
  mostraModale: boolean = false;

  ngOnInit() {
    // Controlla se l'utente ha già visto la modale
    const giaVisto = localStorage.getItem('haVistoBenvenuto');
    if (!giaVisto) {
      this.mostraModale = true; // Se è la prima volta, mostrala
    }
  }

  chiudiModale() {
    this.mostraModale = false;
    // Salva nel browser che l'utente ha chiuso la modale
    localStorage.setItem('haVistoBenvenuto', 'true');
  }
}
