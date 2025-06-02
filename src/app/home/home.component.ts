import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {ToolbarModule} from 'primeng/toolbar';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [
    ChartModule,
    CardModule,
    ToolbarModule,
    MenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {

  }
}
