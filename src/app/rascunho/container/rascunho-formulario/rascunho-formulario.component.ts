import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea'; // Adicionado
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {Rascunho} from '../../model/rascunho.model';
import {buildUsuarioAuth, UsuarioAuth} from '../../../auth/model/usuario-auth';
import {RascunhoService} from '../../service/api/rascunho.service';
import {AuthStateService} from '../../../auth/service/state/auth.state.service';

@Component({
  selector: 'app-rascunho-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    ToolbarModule
  ],
  templateUrl: './rascunho-formulario.component.html',
  styleUrls: ['./rascunho-formulario.component.css'],
  providers: [MessageService]
})
export class RascunhoFormularioComponent implements OnInit {
  form: Rascunho = {assunto: '', corpo: '', emailDestinatario: ''};
  isEditMode = false;
  usuario: UsuarioAuth = buildUsuarioAuth();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rascunhoService: RascunhoService,
    private messageService: MessageService,
    private authState: AuthStateService
  ) {
  }

  ngOnInit(): void {
    this.authState.usuario.subscribe(user => this.usuario = user);
    this.route.data.subscribe(data => {
      this.form = data['rascunho'];
      if (this.form && this.form.rascunhoId) {
        this.isEditMode = true;
      }
    });
  }

  // A função converterHtmlParaTexto foi removida pois não é mais necessária.

  salvar(): void {
    if (!this.usuario.token) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Sessão inválida. Faça login novamente.'});
      return;
    }

    // O payload agora usa o this.form diretamente, pois o corpo já é texto puro.
    const action = this.isEditMode
      ? this.rascunhoService.atualizar(this.form, this.usuario.token)
      : this.rascunhoService.criar(this.form, this.usuario.token);

    action.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Rascunho ${this.isEditMode ? 'atualizado' : 'salvo'}!`
        });
        setTimeout(() => this.router.navigate(['/rascunhos']), 1500);
      },
      error: (err) => {
        const errorMsg = err?.error?.mensagem || 'Ocorreu um erro ao salvar.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMsg});
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/rascunhos']);
  }
}
