import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'local',
    loadChildren: () => import('./local/local.route').then(r => r.LOCAL_ROUTES)
  }
];
