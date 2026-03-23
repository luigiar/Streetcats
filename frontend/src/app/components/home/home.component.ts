import { Component, signal, WritableSignal } from '@angular/core'; // import dei signals
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, MapOptions, marker, icon, Marker, Map as LeafletMap } from 'leaflet';
import { CatService } from '../../services/cat.service';
import { Cat } from '../../models/cat.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LeafletModule, NavbarComponent],
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


  constructor(private catService: CatService) {
    console.log('🏗️ 1. Costruttore Angular 19 OK (Signals ready)');
  }

  onMapReady(map: LeafletMap) {
    console.log('🟢 La mappa è pronta! Sto per chiamare il server...');
    this.map = map;
    this.caricaGatti();
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
