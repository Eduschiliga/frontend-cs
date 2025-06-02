import {Component} from '@angular/core';
import {Button, ButtonModule} from "primeng/button";
import {Router, RouterLink} from '@angular/router';
import {AuthStateService} from '../auth/service/state/auth.state.service';
import {buildUsuarioAuth, UsuarioAuth} from '../auth/model/usuario-auth';
import {AvatarModule} from 'primeng/avatar';
import {UsuarioService} from '../local/service/api/usuario.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-menu',
  imports: [
    Button,
    RouterLink,
    AvatarModule,
    ButtonModule,
    RouterLink,
    AvatarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [MessageService, ConfirmationService]
})
export class MenuComponent {
  protected usuario: UsuarioAuth = buildUsuarioAuth();

  constructor(
    protected route: Router,
    private auth: AuthStateService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.auth.usuario.subscribe(usuario => this.usuario = usuario);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.auth.apagarUsuario();
    this.route.navigate(['/login']).then();
  }

  excluir() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (this.usuario.token != null) {
          this.usuarioService.deletar(this.usuario.token).subscribe(
            {
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Usuário excluído com sucesso!'
                });
                setTimeout(() => {
                  this.logout();
                }, 1500);
              },
              error: (error: HttpErrorResponse) => {
                console.log(error)
                this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
              },
            }
          )
        }
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.'});
      }
    });
  }
}
