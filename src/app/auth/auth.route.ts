import {Routes} from '@angular/router';
import {LoginComponent} from './containers/login/login.component';
import {CadastroComponent} from './containers/cadastro/cadastro.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  }
];
