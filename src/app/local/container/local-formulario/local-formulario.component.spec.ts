import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalFormularioComponent } from './local-formulario.component';

describe('LocalFormularioComponent', () => {
  let component: LocalFormularioComponent;
  let fixture: ComponentFixture<LocalFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
