import {Routes} from '@angular/router';
import {AuthGuard} from './auth/guards/auth.guard';

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
    path: 'auth',
    loadChildren: () => import('./auth/auth.route').then(r => r.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
