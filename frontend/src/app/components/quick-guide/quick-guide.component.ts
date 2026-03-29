import { Component } from '@angular/core';

@Component({
  selector: 'app-quick-guide',
  templateUrl: './quick-guide.component.html',
  styleUrls: ['./quick-guide.component.css']
})
export class QuickGuideComponent {
  isAperto: boolean = true; // Di default la guida è aperta
  toggleGuida() {
    this.isAperto = !this.isAperto; // Inverte lo stato (aperto/chiuso)
  }
}
