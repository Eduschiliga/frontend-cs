import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {Router} from '@angular/router';
import {AuthStateService} from '../auth/service/state/auth.state.service';
import {buildUsuarioAuth, UsuarioAuth} from '../auth/model/usuario-auth';
import {AvatarModule} from 'primeng/avatar';
import {UsuarioService} from '../local/service/api/usuario.service';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AuthApiService} from '../auth/service/api/auth.api.service';
import {MensagemSucesso} from '../model/MensagemSucesso';
import {MenuModule} from 'primeng/menu';
import {PanelMenuModule} from 'primeng/panelmenu';

@Component({
  selector: 'app-menu',
  imports: [
    ButtonModule,
    AvatarModule,
    ConfirmDialogModule,
    ToastModule,
    MenuModule,
    PanelMenuModule
  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [MessageService, ConfirmationService]
})
export class MenuComponent implements OnInit {
  protected usuario: UsuarioAuth = buildUsuarioAuth();

  menuItems: MenuItem[] = [];

  constructor(
    protected route: Router,
    private auth: AuthStateService,
    private authApi: AuthApiService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.auth.usuario.subscribe(usuario => this.usuario = usuario);
  }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Navegação',
        icon: 'pi pi-fw pi-compass',
        expanded: true,
        styleClass: 'font-bold',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/home']
          }
        ]
      },
      {
        label: 'Minha Conta',
        icon: 'pi pi-fw pi-user',
        expanded: true,
        items: [
          {
            label: 'Editar Perfil',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: ['/usuario/editar']
          },
          {
            label: 'Excluir Conta',
            icon: 'pi pi-fw pi-trash',
            command: () => this.excluir()
          }
        ]
      }
    ];
  }

  logout() {
    let token = this.usuario.token;
    if (token != null) {
      this.authApi.logout(token).subscribe({
        next: (msg: MensagemSucesso) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: msg.mensagem
          });
          this.limparDados();
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
        },
      });
    }
  }

  limparDados() {
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
          this.usuarioService.deletar(this.usuario.token).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário excluído com sucesso!'
              });
              this.limparDados()
            },
            error: (error: HttpErrorResponse) => {
              this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
            },
          });
        }
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.'});
      }
    });
  }
}
