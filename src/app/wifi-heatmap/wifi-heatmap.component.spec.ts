import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiHeatmapComponent } from './wifi-heatmap.component';

describe('WifiHeatmapComponent', () => {
  let component: WifiHeatmapComponent;
  let fixture: ComponentFixture<WifiHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WifiHeatmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WifiHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
