import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.route').then(r => r.HOME_ROUTES)
  },
  {
    path: 'local',
    loadChildren: () => import('./local/local.route').then(r => r.LOCAL_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
