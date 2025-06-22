import {Routes} from '@angular/router';
import {EmailResolver} from './guards/email.resolver';
import {RascunhoResolver} from '../rascunho/guards/rascunho.resolver';
import {EmailListComponent} from './email-list/email-list.component';
import {EmailFormComponent} from './email-form/email-form.component';
import {EmailViewComponent} from './email-view/email-view.component';

export const EMAIL_ROUTES: Routes = [
  {path: '', component: EmailListComponent},
  {path: 'novo', component: EmailFormComponent},
  {
    path: 'responder/:id', // Nova rota para responder, passando o ID do e-mail
    component: EmailFormComponent,
    resolve: {
      emailParaPreencher: EmailResolver // Usa o EmailResolver para carregar o e-mail
    }
  },
  {
    path: 'enviar-rascunho/:id',
    component: EmailFormComponent,
    resolve: {
      rascunho: RascunhoResolver
    }
  },
  {
    path: 'visualizar/:id',
    component: EmailViewComponent,
    resolve: {
      email: EmailResolver
    }
  }
];
