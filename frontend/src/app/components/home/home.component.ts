import { Component, signal, WritableSignal, inject, NgZone} from '@angular/core'; // import dei signals
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, MapOptions, marker, icon, Marker, Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import { CatService } from '../../services/cat.service';
import { Cat } from '../../models/cat.model';
import { AuthService } from '../../services/auth.service';
import { CatModalComponent } from '../cat-modal/cat-modal.component';
import { CatDetailModalComponent } from '../cat-detail-modal/cat-detail-modal.component';
import { RouterLink } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LeafletModule, CatModalComponent, CatDetailModalComponent, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  // Opzioni della mappa
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng(41.9028, 12.4964)
  };

  // layers è un signal che contiene un array di Marker
  layers: WritableSignal<Marker[]> = signal([]);

  // Icona dei gatti
  catIcon = icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  private map!: LeafletMap;
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);



  constructor(private catService: CatService) {
    console.log('🏗️ 1. Costruttore Angular 19 OK (Signals ready)');
  }

  onMapReady(map: LeafletMap) {
    console.log('🟢 La mappa è pronta! Sto per chiamare il server...');
    this.map = map;
    this.caricaGatti();

    this.map.on('click', (evento: any) => this.gestisciClicMappa(evento));
  }


  //variabili per la modale
  mostraModaleAggiunta = false;
  coordinateCliccate: { lat: number, lng: number } | null = null;
// Variabili per la modale DETTAGLIO
  mostraModaleDettaglio = false;
  gattoSelezionato: Cat | null = null;
  mostraModaleLoginAlert =false;
  mostraModaleStato = false;
  messaggioStato = '';
  isErroreStato = false;
//variabili per la ricerca
searchQuery = '';
private http = inject(HttpClient);


  //logic di click mappa
  private gestisciClicMappa(evento: LeafletMouseEvent) {
    this.ngZone.run(() => {
    const lat = evento.latlng.lat;
    const lng = evento.latlng.lng;

    if(this.authService.currentUser()){
      console.log(`📍 Cliccato a Lat: ${lat}, Lng: ${lng}. UTENTE LOGGATO! Apriamo il form...`);
      this.coordinateCliccate = { lat, lng };
      this.mostraModaleAggiunta = true;

    } else{
      console.warn('🛑 Utente non loggato ha provato ad aggiungere un gatto.');
        this.mostraModaleLoginAlert = true;
    }
  });
  }
chiudiAlert() {
  this.mostraModaleLoginAlert = false;
}

  chiudiModale() {
    this.mostraModaleAggiunta = false;
    this.coordinateCliccate= null;
  }

  salvaNuovoGatto(datiGatto: any) {
    console.log('🚀 Dati ricevuti dal componente figlio!', datiGatto);

    const formData = new FormData();
    formData.append('title', datiGatto.title);

    //se la descrizione è vuota, aggiungo una descrizione di default
    //chiamata al backend per salvare il nuovo gatto
    formData.append('description', datiGatto.description || '');
    formData.append('latitude', datiGatto.latitude.toString());
    formData.append('longitude', datiGatto.longitude.toString());
    formData.append('image', datiGatto.image);

    this.catService.addCat(formData).subscribe({
      next:(nuovoGattoSalvato) => {
      console.log('✅ Nuovo gatto salvato con successo!', nuovoGattoSalvato);

    this.chiudiModale();

    this.caricaGatti();

    // Mostriamo il successo
    this.messaggioStato = 'Gatto salvato con successo! Grazie per la segnalazione. 🐾';
    this.isErroreStato = false;
    this.mostraModaleStato = true;
      },
      error:(err)=>{
        console.error('❌ Errore durante il salvataggio:', err);
        this.messaggioStato = 'Ops! Qualcosa è andato storto durante il salvataggio. Riprova più tardi.';
        this.isErroreStato = true;
        this.mostraModaleStato = true;
      }
    });
  }

  chiudiModaleStato() {
  this.mostraModaleStato = false;
}
  caricaGatti() {
    this.catService.getCats().subscribe({
      next: (cats: Cat[]) => {
        console.log('🐈 Gatti ricevuti dal server:', cats);

        const nuoviMarker = cats.map(cat => {
          // la lattudine e longitudine potrebbero essere stringhe
          const lat = typeof cat.latitude === 'string' ? parseFloat(cat.latitude) : cat.latitude;
          const lng = typeof cat.longitude === 'string' ? parseFloat(cat.longitude) : cat.longitude;

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`⚠️ Coordinate non valide per il gatto "${cat.title}":`, lat, lng);
            return null;
          }

          const m = marker([lat, lng], { icon: this.catIcon });
          m.on('click', () => {
          this.ngZone.run(() => {
          console.log(`📌 Marker cliccato: ${cat.title} (ID: ${cat.id})`);
          this.gattoSelezionato = cat;
          this.mostraModaleDettaglio = true;
          });
          });


          return m;

        });

        // aggiornamento dei signal
        this.layers.set(nuoviMarker.filter(m => m !== null) as Marker[]);

        console.log('✅ Signal dei marker aggiornato:', this.layers().length);
      },
      error: (err) => console.error('❌ Errore caricamento gatti:', err)
    });
  }
//metodo per chiudere la modale dettaglio
chiudiModaleDettaglio() {
this.mostraModaleDettaglio = false;
this.gattoSelezionato = null;
}


  cercaIndirizzo() {
    if(!this.searchQuery.trim()) return;
    console.log(` Cerco l'indirizzo: ${this.searchQuery}`);

    //Api di OpenStreetMap per la geocodifica (Nominatim)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`;
    this.http.get<any[]>(url).subscribe({
    next: (risultati) => {
    if(risultati && risultati.length > 0) {
    //primo risultato più rilevante
    const lat = parseFloat(risultati[0].lat);
    const lng = parseFloat(risultati[0].lon);

    console.log(`📍 Trovato! Volo a Lat: ${lat}, Lng: ${lng}`);

    //zoom di leaftlet sulla posizione trovata
    this.map.flyTo([lat, lng], 18, {
    animate: true,
    duration: 1.5 //durata dell'animazione in secondi
  });

  //svuoto la barra di ricerca
  this.searchQuery = '';
    } else{
      alert('Indirizzo non trovato! Prova a essere più specifico (es. "Via Roma, Milano").');
    }
},
error: (err) => {
        console.error('❌ Errore durante la ricerca:', err);
        alert('Errore di connessione al server delle mappe.');
        }
});
  }
}


