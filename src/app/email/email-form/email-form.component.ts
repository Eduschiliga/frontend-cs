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
export class EmailFormComponent implements OnInit, AfterViewInit { // Implementar AfterViewInit
  form: EmailCriacao = { emailDestinatario: '', assunto: '', corpo: '' };
  isFromDraft = false;
  draftId: number | null = null;
  usuario: UsuarioAuth = buildUsuarioAuth();
  tituloPagina = 'Novo E-mail';

  @ViewChild('editorElement') editorElement!: ElementRef; // Adicionar ViewChild para o editor

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

  // Novo lifecycle hook para verificar após a renderização da view
  ngAfterViewInit(): void {
    // Adicionar um pequeno atraso para garantir que o Quill esteja totalmente inicializado
    setTimeout(() => {
      if (this.editorElement && this.editorElement.nativeElement) {
        console.log('Conteúdo atual do p-editor (via innerHTML):', this.editorElement.nativeElement.querySelector('.ql-editor')?.innerHTML);
      } else {
        console.log('Elemento p-editor não encontrado no AfterViewInit.');
      }
    }, 500); // 500ms de atraso
  }

  private preencherParaResposta(email: Email): void {
    this.tituloPagina = 'Responder E-mail';
    this.form.emailDestinatario = email.emailRemetente || '';
    this.form.assunto = `Re: ${email.assunto}`;

    const dataFormatada = email.dataEnvio
      ? formatDate(email.dataEnvio, "dd/MM/yyyy 'às' HH:mm", 'pt-BR')
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

    // Garante que email.corpo seja uma string para manipulação segura
    const corpoOriginalBruto = email.corpo || '';

    // Teste 1: Console.log do conteúdo bruto e do conteúdo a ser setado
    console.log('DEBUG - Conteúdo original do e-mail (email.corpo):', corpoOriginalBruto);
    console.log('DEBUG - Tipo de email.corpo:', typeof corpoOriginalBruto);


    // --- TESTE 1: Inserir um texto simples para ver se o editor funciona ---
    // this.form.corpo = "<div>Este é um teste simples. Se você vir isso, o editor está funcionando.</div>";

    // --- TESTE 2: Conteúdo com o cabeçalho e corpo original (sem o blockquote para isolar) ---
    // Mantenha esta linha COMENTADA para fazer o TESTE 1 primeiro.
    // Se o TESTE 1 funcionar, DESCOMENTE ESTA LINHA e COMENTE O TESTE 1.
    this.form.corpo = `${cabecalhoResposta}${corpoOriginalBruto}`; // <-- Esta é a linha da última tentativa.

    // --- TESTE 3: Voltar com o blockquote se o TESTE 2 funcionar e o problema for a formatação.
    // Se o TESTE 2 funcionar, e o problema for a formatação, DESCOMENTE ABAIXO e COMENTE AS LINHAS DE TESTE ANTERIORES.
    // const corpoComBlockquote = `<blockquote style="border-left: 2px solid #ccc; margin-left: 10px; padding-left: 10px;">${corpoOriginalBruto}</blockquote>`;
    // this.form.corpo = `${cabecalhoResposta}${corpoComBlockquote}`;

    console.log('DEBUG - Conteúdo FINAL a ser setado no editor (this.form.corpo):', this.form.corpo);

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
    console.log('DEBUG - Conteúdo do rascunho (rascunho.corpo):', rascunho.corpo);
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
