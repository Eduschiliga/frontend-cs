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
    path: 'local',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./local/local.route').then(r => r.LOCAL_ROUTES)
  },
  {
    path: 'wifiheatmap',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./wifi-heatmap/wifi-heatmap.route').then(r => r.WIFI_ROUTES)
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
