import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cat } from '../../models/cat.model';
import { marked } from 'marked'; // traduttore per il markdown

@Component({
  selector: 'app-cat-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-detail-modal.component.html',
  styleUrl: './cat-detail-modal.component.css'
})
export class CatDetailModalComponent {
  // gatto da visualizzare
  cat = input<Cat | null>(null);

  // evento per chiudere il modal
  closeModal = output<void>();

  // SIGNAL, trasforma la descrizione in markdown in HTML, se non c'è descrizione mostra un messaggio di default
  parsedDescription = computed(() => {
    const desc = this.cat()?.description;
    if (!desc) return '<i>Nessuna descrizione disponibile.</i>';

    // Converte "**grassetto**" in "<b>grassetto</b>"
    return marked.parse(desc) as string;
  });

  // Funzione per costruire l'URL corretto dell'immagine
  getImageUrl(): string {
    const imgPath = this.cat()?.image_url;

    if (!imgPath) {
      // Se non c'è foto, mostro una griglia di default
      return 'https://via.placeholder.com/400x300?text=Foto+non+disponibile';
    }

    // Se è un link completo, lo tengo cosi
    if (imgPath.startsWith('http')) return imgPath;

    //aggiungo l'indirizzo del backend se è un percorso relativo
    const path = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `http://localhost:3000${path}`;
  }
}
