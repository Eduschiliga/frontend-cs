import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RascunhoListComponent } from './rascunho-list.component';

describe('RascunhoListComponent', () => {
  let component: RascunhoListComponent;
  let fixture: ComponentFixture<RascunhoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RascunhoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RascunhoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
