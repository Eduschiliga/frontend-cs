import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Button, ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ButtonDirective, Button],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'analiserede-frontend';
}
