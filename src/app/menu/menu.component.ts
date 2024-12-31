import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Router, RouterLink} from '@angular/router';
import {AuthStateService} from '../auth/service/state/auth.state.service';
import {buildUsuarioAuth, UsuarioAuth} from '../auth/model/usuario-auth';
import {AvatarModule} from 'primeng/avatar';

@Component({
  selector: 'app-menu',
  imports: [
    Button,
    RouterLink,
    AvatarModule

  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  protected usuario: UsuarioAuth = buildUsuarioAuth();

  constructor(
    protected route: Router,
    private auth: AuthStateService
  ) {
    this.auth.usuario.subscribe(usuario => this.usuario = usuario);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.auth.apagarUsuario();
    this.route.navigate(['/login']).then();
  }
}
