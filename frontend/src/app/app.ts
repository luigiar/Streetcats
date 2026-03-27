import { Component, signal, inject } from '@angular/core';
import {CommonModule} from "@angular/common";
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotificationService } from './services/notification.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  public notificationService = inject(NotificationService);
}



