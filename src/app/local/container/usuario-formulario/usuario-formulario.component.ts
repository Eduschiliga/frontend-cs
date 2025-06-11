import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {buildUsuario, UsuarioAtualizar} from '../../model/usuario-atualizar';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {Router} from '@angular/router';
import {CalendarModule} from 'primeng/calendar';
import {FieldsetModule} from 'primeng/fieldset';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToolbarModule} from "primeng/toolbar";
import {buildUsuarioAuth, UsuarioAuth} from '../../../auth/model/usuario-auth';
import {AuthStateService} from '../../../auth/service/state/auth.state.service';
import {UsuarioResponse} from '../../../auth/model/usuario';
import {UsuarioService} from '../../service/api/usuario.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-usuario-formulario',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CalendarModule,
    FieldsetModule,
    ConfirmDialogModule,
    ToolbarModule,
    PasswordModule,
  ],
  templateUrl: './usuario-formulario.component.html',
  styleUrl: './usuario-formulario.component.css',
  standalone: true,
  providers: [MessageService, ConfirmationService]
})
export class UsuarioFormularioComponent implements OnInit {
  protected form: UsuarioAtualizar = buildUsuario();
  protected usuarioLogado: UsuarioAuth = buildUsuarioAuth();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private auth: AuthStateService,
    private usuarioApi: UsuarioService
  ) {
    this.auth.usuario$.subscribe(usuarioAuth => {
      this.usuarioLogado = usuarioAuth;
      if (this.usuarioLogado.isAuth) {
          this.form.nome = this.usuarioLogado.nome;
      }
    });
  }

  ngOnInit(): void {
    if (!(this.usuarioLogado && this.usuarioLogado.isAuth)) {
      this.router.navigate(['/login']);
    } else {
      if (this.usuarioLogado.nome && (!this.form.nome || this.form.nome !== this.usuarioLogado.nome)) {
        this.form.nome = this.usuarioLogado.nome;
      }
    }
  }

  salvar(): void {
    if (!this.usuarioLogado.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Sessão expirada. Faça login novamente.'
      });
      this.router.navigate(['/login']);
      return;
    }

    if (this.form.nome.trim() === '' || this.form.senha.trim() === '') {
      let erroDetalhe = 'O nome do usuário e a nova senha são obrigatórios.';
      if (this.form.nome.trim() === '') {
        erroDetalhe = 'O nome do usuário é obrigatório.';
      } else if (this.form.senha.trim() === '') {
        erroDetalhe = 'A nova senha é obrigatória.';
      }
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: erroDetalhe
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja salvar as alterações em seu perfil?',
      header: 'Confirmar Alterações',
      icon: 'pi pi-save',
      acceptLabel: 'Sim, salvar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.executarAtualizacao();
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Cancelado', detail: 'As alterações não foram salvas.'});
      }
    });
  }

  private executarAtualizacao(): void {
    if (this.usuarioLogado.token && this.form.nome.trim() !== '' && this.form.senha.trim() !== '') {
      const dadosParaAtualizar: UsuarioAtualizar = {
        nome: this.form.nome.trim(),
        senha: this.form.senha.trim()
      };

      this.usuarioApi.atualizar(dadosParaAtualizar, this.usuarioLogado.token).subscribe({
        next: (response: UsuarioResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: response.mensagem || 'Usuário atualizado com sucesso!'
          });

          this.auth.usuario = {
            ...this.usuarioLogado,
            nome: dadosParaAtualizar.nome
          };

          this.form.senha = '';

          setTimeout(() => {
            this.voltar();
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
        },
      });
    } else {
      let erroDetalhe = 'Não foi possível salvar. Verifique os dados e sua sessão.';
      if (!this.usuarioLogado.token) {
        erroDetalhe = 'Sessão expirada. Faça login novamente.';
        this.router.navigate(['/login']);
      } else if (this.form.nome.trim() === '') {
        erroDetalhe = 'O nome do usuário é obrigatório.';
      } else if (this.form.senha.trim() === '') {
        erroDetalhe = 'A nova senha é obrigatória.';
      }
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: erroDetalhe
      });
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
