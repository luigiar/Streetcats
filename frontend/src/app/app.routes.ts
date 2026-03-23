import { Routes } from '@angular/router';
// componente Home
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    // Se l'indirizzo è vuoto, carica il componente HomeComponent
    { path: '', component: HomeComponent },
    // Se l'indirizzo è sbagliato, rimanda a Home
    { path: '**', redirectTo: '' }
];

