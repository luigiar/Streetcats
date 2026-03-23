import { Component} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { latLng, tileLayer, MapOptions, marker, icon, Marker, Map as LeafletMap} from 'leaflet';
import { CatService } from '../../services/cat.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {
  options: MapOptions = {
    layers: [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
    })
    ],
    zoom: 6, //zoom iniziale
    center: latLng(41.9028, 12.4964) //centro iniziale (Roma)
};
  layers: Marker[] = [];
  catIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

//variabile per salvare la mappa
private map!: LeafletMap;

  //inietto il service Cat nel componente
  constructor(private catService: CatService) {
    console.log('🏗️ 1. Costruttore OK');
    console.log('🗺️ 2. Opzioni mappa caricate:', this.options);
  }
  onMapReady(map: any) {
    console.log('🟢 La mappa è pronta! Sto per chiamare il server...');
    this.map = map as LeafletMap;
    this.caricaGatti();
  }


caricaGatti() {
  this.catService.getCats().subscribe({
    next: (cats) => {
      console.log('🐈 Gatti ricevuti:', cats);

      // Crezione dei marker
      const nuoviMarker = cats.map(cat => {
        const lat = Number(cat.latitude);
        const lng = Number(cat.longitude);

        const m = marker([lat, lng], { icon: this.catIcon });
        m.bindPopup(`<b>${cat.title}</b>`);
        return m;
      });

      // creazione di un nuovo array di marker e assegnazione a this.layers
      this.layers = [...nuoviMarker];

      console.log('✅ Marker pronti:', this.layers.length);
    }
  });
}
}

