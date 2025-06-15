import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import {buildUsuarioAuth, UsuarioAuth} from '../../../auth/model/usuario-auth';
import {Rascunho} from '../../model/rascunho.model';
import {RascunhoService} from '../../service/api/rascunho.service';
import {RascunhoState} from '../../service/state/rascunho.state';
import {AuthStateService} from '../../../auth/service/state/auth.state.service';
import {MenuComponent} from '../../../menu/menu.component';
import {DockModule} from 'primeng/dock';

@Component({
  selector: 'app-rascunho-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    DockModule,
  ],
  templateUrl: './rascunho-list.component.html',
  styleUrls: ['./rascunho-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class RascunhoListComponent implements OnInit {
  protected usuario: UsuarioAuth = buildUsuarioAuth();
  protected rascunhos: Rascunho[] = [];

  constructor(
    private rascunhoService: RascunhoService,
    private rascunhoState: RascunhoState,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authState: AuthStateService
  ) {
    this.authState.usuario.subscribe(usuario => this.usuario = usuario);
    this.rascunhoState.getRascunhos().subscribe(rascunhos => {
      this.rascunhos = rascunhos;
    });
  }

  ngOnInit(): void {
    console.log(this.usuario)
    if (this.usuario.token) {
      this.rascunhoService.buscarTodos(this.usuario.token).subscribe({
        next: (response) => {
          this.rascunhoState.setRascunhos(response.rascunhos);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar rascunhos.' });
        }
      });
    }
  }

  criarRascunho(): void {
    this.router.navigate(['/rascunhos/novo']);
  }

  editarRascunho(rascunho: Rascunho): void {
    this.router.navigate(['/rascunhos/editar', rascunho.rascunhoId]);
  }

  deletarRascunho(rascunho: Rascunho): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o rascunho "${rascunho.assunto}"?`,
      header: 'Confirmação para Deletar',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (rascunho.rascunhoId && this.usuario.token) {
          this.rascunhoService.deletar(rascunho.rascunhoId, this.usuario.token).subscribe({
            next: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Rascunho deletado com sucesso', life: 3000 });
              const rascunhosAtuais = this.rascunhos.filter(r => r.rascunhoId !== rascunho.rascunhoId);
              this.rascunhoState.setRascunhos(rascunhosAtuais);
            },
            error: (err: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erro ao deletar', detail: err.message, life: 3000 });
            }
          });
        }
      }
    });
  }
}
