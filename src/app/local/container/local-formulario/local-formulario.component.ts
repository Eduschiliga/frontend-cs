import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {buildLocal, Local} from '../../model/local';
import {LocalApiService} from '../../service/api/local-api.service';
import {Button} from 'primeng/button';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ActivatedRoute, Router} from '@angular/router';
import {window} from 'rxjs';
import {buildMedicao, Medicao} from '../../../medicao/model/medicao';
import {CalendarModule} from 'primeng/calendar';
import {FieldsetModule} from 'primeng/fieldset';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-local-formulario',
  imports: [
    FormsModule,
    InputTextModule,
    Button,
    ToastModule,
    CalendarModule,
    FieldsetModule,
    ConfirmDialogModule,
  ],
  templateUrl: './local-formulario.component.html',
  styleUrl: './local-formulario.component.css',
  standalone: true,
  providers: [MessageService, ConfirmationService
  ]
})
export class LocalFormularioComponent implements OnInit {
  protected form: Local;
  protected readonly window = window;
  protected rotaAtual = '';

  constructor(
    private localApi: LocalApiService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {
    this.rotaAtual = this.route.snapshot.url[0].path;
    this.form = this.route.snapshot.data['local'];
  }

  salvar() {
    if (this.form.nome != '') {
      if (this.rotaAtual == 'novo') {
        this.localApi.salvar(this.form, 'eduardo@gmail.com').subscribe(
          {
            next: (local: Local) => {
              this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Local salvo com sucesso'});
              this.form = buildLocal();
            },
            error: (error: any) => {
              this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao salvar local'});

            }
          }
        )
      }

      if (this.rotaAtual == 'editar') {
        this.localApi.editar(this.form).subscribe(
          {
            next: (local: Local) => {
              this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Local editado com sucesso'});
              this.voltar();
            },
            error: (error: any) => {
              this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao editar local'});

            }
          }
        )
      }

    } else {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Nome do local é obrigatório'});

    }
  }

  ngOnInit(): void {
  }

  voltar() {
    this.router.navigate(['/local']);
  }

  adicionarMedicao() {
    this.form.medicoes.push(buildMedicao());
  }

  removerMedicao($index: number, medicao: Medicao) {

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta medição?',
      header: 'Confirmação para Deletar',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        if (medicao.id) {
          if (this.rotaAtual == 'editar') {
            this.localApi.deletarMedicao(medicao.id).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Medição excluída com sucesso'
                });
              },
              error: (error: any) => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao excluir medição'});
              },
            });
          }
        }
        this.form.medicoes.splice($index, 1);
      }
    });


  }
}
