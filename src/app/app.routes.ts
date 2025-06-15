import {Routes} from '@angular/router';
import {AuthGuard} from './auth/guards/auth.guard';
import {RASCUNHO_ROUTES} from './rascunho/rascunho.route';

export const routes: Routes = [

  {
    path: 'home',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./home/home.route').then(r => r.HOME_ROUTES)
  },
  {
    path: 'usuario',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./local/usuario.route').then(r => r.USUARIO_ROUTES)
  },

  {
    path: 'rascunhos',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./rascunho/rascunho.route').then(r => r.RASCUNHO_ROUTES)
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.route').then(r => r.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
