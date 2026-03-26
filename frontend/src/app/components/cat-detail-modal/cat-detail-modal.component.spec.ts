import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDetailModalComponent } from './cat-detail-modal.component';

describe('CatDetailModalComponent', () => {
  let component: CatDetailModalComponent;
  let fixture: ComponentFixture<CatDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
