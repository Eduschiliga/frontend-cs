import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RascunhoFormularioComponent } from './rascunho-formulario.component';

describe('RascunhoFormularioComponent', () => {
  let component: RascunhoFormularioComponent;
  let fixture: ComponentFixture<RascunhoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RascunhoFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RascunhoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
