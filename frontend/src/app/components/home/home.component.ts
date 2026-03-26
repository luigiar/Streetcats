import { Component, signal, WritableSignal, inject, NgZone} from '@angular/core'; // import dei signals
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, MapOptions, marker, icon, Marker, Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import { CatService } from '../../services/cat.service';
import { Cat } from '../../models/cat.model';
import { AuthService } from '../../services/auth.service';
import { CatModalComponent } from '../cat-modal/cat-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LeafletModule, CatModalComponent, NavbarComponent],
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

  mostraModaleAggiunta = false;
  coordinateCliccate: { lat: number, lng: number } | null = null;


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
      alert('🐾 Fai il Login o Registrati per poter segnalare un gatto sulla mappa!');
    }
  });
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
      },
      error:(err)=>{
        console.error('❌ Errore durante il salvataggio:', err);
        alert('Ops! Errore durante il salvataggio. Controlla la console.');
      }
    });
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
          m.bindPopup(`<b>${cat.title}</b><br>Gatto di quartiere 🐾`);
          return m;
        });

        // aggiornamento dei signal
        this.layers.set(nuoviMarker.filter(m => m !== null) as Marker[]);

        console.log('✅ Signal dei marker aggiornato:', this.layers().length);
      },
      error: (err) => console.error('❌ Errore caricamento gatti:', err)
    });
  }
}
