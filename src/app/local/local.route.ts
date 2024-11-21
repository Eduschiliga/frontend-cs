import {Routes} from '@angular/router';
import {LocalComponent} from './container/local-list/local.component';
import {LocalFormularioComponent} from './container/local-formulario/local-formulario.component';
import {LocalResolver} from './guards/local.resolver';


export const LOCAL_ROUTES: Routes = [
  {path: '', component: LocalComponent},
  {
    path: 'novo', component: LocalFormularioComponent, resolve: {local: LocalResolver}
  },
  {path: 'editar/:id', component: LocalFormularioComponent, resolve: {local: LocalResolver}},
];
