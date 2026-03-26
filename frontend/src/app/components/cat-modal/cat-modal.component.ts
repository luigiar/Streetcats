import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cat-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cat-modal.component.html',
  styleUrl: './cat-modal.component.css'
})
export class CatModalComponent {
  //  Riceve le coordinate dal padre
  coords = input<{lat: number, lng: number} | null>(null);

  // Emette eventi verso il padre
  closeModal = output<void>(); // Per chiudere la modale
  saveCat = output<any>();     // Per inviare i dati pronti

  catForm: FormGroup;
  private fb = inject(FormBuilder);

  selectedFile: File | null = null;

  constructor() {
    this.catForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
    this.selectedFile = file;
    }
  }

  // L'utente clicca Annulla o la X
  onCancel() {
    this.catForm.reset();
    this.closeModal.emit();
  }

  // L'utente clicca Salva
  onSubmit() {

    if (this.catForm.invalid || !this.selectedFile){
      alert("⚠️ Inserisci il nome e carica la foto del gatto!");
      return;
    }

    const currentCoords = this.coords();
    if (!currentCoords) return;

    // Unisco i dati pronti
    const datiPronti = {
      ...this.catForm.value,
      latitude: currentCoords.lat,
      longitude: currentCoords.lng,
      image: this.selectedFile
    };

    // Li mando verso il padre (HomeComponent)
    this.saveCat.emit(datiPronti);
    this.catForm.reset();
    this.selectedFile = null;
  }
}
