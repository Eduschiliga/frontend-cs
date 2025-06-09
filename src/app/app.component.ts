import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {MenuComponent} from './menu/menu.component';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent {

  exibirMenu = false;

  constructor(private router: Router, private msg: MessageService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      this.exibirMenu = !event.urlAfterRedirects.startsWith('/auth');
    });
  }

  title = 'analiserede-frontend';
}
