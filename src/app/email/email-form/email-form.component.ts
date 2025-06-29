import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'; // Adicionar AfterViewInit, ViewChild, ElementRef
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import {Email, EmailCriacao} from '../model/email.model';
import {buildUsuarioAuth, UsuarioAuth} from '../../auth/model/usuario-auth';
import {EmailService} from '../service/EmailService';
import {AuthStateService} from '../../auth/service/state/auth.state.service';
import {Rascunho} from '../../rascunho/model/rascunho.model';
import { combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ToolbarModule, InputTextModule, EditorModule, ButtonModule],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css'],
  providers: [MessageService]
})
export class EmailFormComponent implements OnInit, AfterViewInit {
  form: EmailCriacao = { emailDestinatario: '', assunto: '', corpo: '' };
  isFromDraft = false;
  draftId: number | null = null;
  usuario: UsuarioAuth = buildUsuarioAuth();
  tituloPagina = 'Novo E-mail';

  @ViewChild('editorElement') editorElement!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private messageService: MessageService,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.authState.usuario.pipe(take(1)),
      this.route.data
    ]).subscribe(([user, data]) => {
      this.usuario = user;

      const emailParaPreencher: Email | undefined = data['emailParaPreencher'];
      const rascunho: Rascunho | undefined = data['rascunho'];

      if (emailParaPreencher) {
        this.preencherParaResposta(emailParaPreencher);
      } else if (rascunho && rascunho.rascunhoId) {
        this.preencherDeRascunho(rascunho);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 500);
  }

  private preencherParaResposta(email: Email): void {
    this.tituloPagina = 'Responder E-mail';
    this.form.emailDestinatario = email.emailRemetente || '';
    this.form.assunto = `Re: ${email.assunto}`;

    const dataFormatada = email.dataEnvio
      ? formatDate(email.dataEnvio, "dd/MM/yyyy", 'pt-BR')
      : 'data desconhecida';

    const cabecalhoResposta = `
      <p>---------- Mensagem Original ----------</p>
      <p>De: ${email.emailRemetente || 'Desconhecido'}</p>
      <p>Para: ${email.emailDestinatario || 'Desconhecido'}</p>
      <p>Assunto: ${email.assunto || 'Sem Assunto'}</p>
      <p>Data: ${dataFormatada}</p>
      <hr>
      <br>
    `;

    const corpoOriginalBruto = "<p>" + email.corpo + "</p>" || '';

    this.form.corpo = `${cabecalhoResposta}${corpoOriginalBruto}`;
  }

  private preencherDeRascunho(rascunho: Rascunho): void {
    this.tituloPagina = 'Enviar Rascunho';
    this.isFromDraft = true;
    this.draftId = rascunho.rascunhoId ? rascunho.rascunhoId : null;
    this.form = {
      emailDestinatario: rascunho.emailDestinatario || '',
      assunto: rascunho.assunto || '',
      corpo: rascunho.corpo || ''
    };
  }

  enviar(): void {
    if (!this.usuario.token) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Sessão inválida. Por favor, faça login novamente.' });
      return;
    }

    if (!this.form.emailDestinatario || !this.form.assunto || !this.form.corpo) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios: Destinatário, Assunto e Corpo do E-mail.' });
      return;
    }

    const action = this.isFromDraft && this.draftId
      ? this.emailService.enviarRascunho(this.draftId, this.usuario.token)
      : this.emailService.enviarEmail(this.form, this.usuario.token);

    action.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'E-mail enviado com sucesso!' });
        setTimeout(() => this.router.navigate(['/emails']), 1500);
      },
      error: (err) => {
        const errorMsg = err?.error?.mensagem || 'Ocorreu um erro ao enviar o e-mail.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMsg });
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/emails']);
  }
}
