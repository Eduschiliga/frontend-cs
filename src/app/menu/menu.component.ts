import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {Menu, MenuModule} from 'primeng/menu';

import {AuthStateService} from '../auth/service/state/auth.state.service';
import {AuthApiService} from '../auth/service/api/auth.api.service';
import {UsuarioService} from '../local/service/api/usuario.service';

import {buildUsuarioAuth, UsuarioAuth} from '../auth/model/usuario-auth';
import {MensagemSucesso} from '../model/MensagemSucesso';

import {ButtonModule} from "primeng/button";
import {AvatarModule} from 'primeng/avatar';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MenubarModule} from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ButtonModule,
    AvatarModule,
    ToastModule,
    ConfirmDialogModule,
    MenubarModule,
    MenuModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MenuComponent implements OnInit {
  protected usuario: UsuarioAuth = buildUsuarioAuth();

  items: MenuItem[] = [];

  userMenuItems: MenuItem[] = [];

  @ViewChild('userMenu') userMenu: Menu | undefined;

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
    // Define os itens da barra de navegação principal
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/home']
      },
      {
        label: 'E-mails',
        icon: 'pi pi-fw pi-envelope',
        routerLink: ['/emails']
      },
      {
        label: 'Rascunhos',
        icon: 'pi pi-fw pi-inbox',
        routerLink: ['/rascunhos']
      }
    ];

    this.userMenuItems = [
      {
        label: 'Editar Perfil',
        icon: 'pi pi-fw pi-user-edit',
        routerLink: ['/usuario/editar']
      },
      {
        label: 'Excluir Conta',
        icon: 'pi pi-fw pi-trash',
        command: () => this.excluir()
      },
      {
        separator: true // Usamos o separador para criar uma divisão visual
      },
      {
        label: 'Desconectar',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  toggleUserMenu(event: Event) {
    this.userMenu?.toggle(event);
  }

  logout() {
    let token = this.usuario.token;
    if (token != null) {
      this.authApi.logout(token).subscribe({
        next: (msg: MensagemSucesso) => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: msg.mensagem});
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
