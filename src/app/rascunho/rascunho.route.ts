import {Routes} from '@angular/router';
import {RascunhoListComponent} from './container/rascunho-list/rascunho-list.component';
import {RascunhoFormularioComponent} from './container/rascunho-formulario/rascunho-formulario.component';
import {RascunhoResolver} from './guards/rascunho.resolver';


export const RASCUNHO_ROUTES: Routes = [
  {path: '', component: RascunhoListComponent},
  {
    path: 'novo',
    component: RascunhoFormularioComponent,
    resolve: {
      rascunho: RascunhoResolver
    }
  },
  {
    path: 'editar/:id',
    component: RascunhoFormularioComponent,
    resolve: {
      rascunho: RascunhoResolver
    }
  }
];
