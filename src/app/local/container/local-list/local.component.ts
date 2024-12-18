import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {LocalApiService} from '../../service/api/local-api.service';
import {LocalStateService} from '../../service/state/local-state.service';
import {Local} from '../../model/local';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToolbarModule} from 'primeng/toolbar';

@Component({
  selector: 'app-local',
  imports: [
    TableModule,
    Button,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css'
})
export class LocalComponent implements OnInit {
  protected locais: Local[] = [];

  constructor(
    private localApi: LocalApiService,
    private localState: LocalStateService,
    protected route: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.localState.local$.subscribe(
      {
        next: (local: Local[]) => {
          this.locais = local;
        }
      }
    )
  }

  ngOnInit(): void {
    this.localApi.buscarTodosPorUsuario(1).subscribe(
      {
        next: (local: Local[]) => {
          this.localState.setLocalList(local);
        }
      }
    )
  }

  editar(local: Local) {
    this.route.navigate(['/local/editar/', local.id]);
  }

  excluir(local: Local) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este local?',
      header: 'Confirmação para Deletar',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        if (local.id) {
          this.localApi.deletar(local.id).subscribe(
            {
              next: () => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Confirmação',
                  detail: 'Local Deletado com sucesso',
                  life: 3000
                });

                let temp = this.locais.filter(l => l.id != local.id);
                this.localState.setLocalList(temp);
              },
              error: (error: any) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro ao deletar',
                  detail: error.getMessage(),
                  life: 3000
                });
              }
            }
          );
        }

      }
    });
  }
}
