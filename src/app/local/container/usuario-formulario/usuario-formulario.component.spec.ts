import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFormularioComponent } from './usuario-formulario.component';

describe('UsuarioFormularioComponent', () => {
  let component: UsuarioFormularioComponent;
  let fixture: ComponentFixture<UsuarioFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
