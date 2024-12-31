import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';
import {WifiHeatmapComponent} from './wifi-heatmap/wifi-heatmap.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Button, WifiHeatmapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'analiserede-frontend';
}
