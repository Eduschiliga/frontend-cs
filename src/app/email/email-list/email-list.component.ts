import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import {buildUsuarioAuth, UsuarioAuth} from '../../auth/model/usuario-auth';
import {Email} from '../model/email.model';
import {EmailService} from '../service/EmailService';
import {EmailState} from '../service/EmailState';
import {AuthStateService} from '../../auth/service/state/auth.state.service';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ],
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class EmailListComponent implements OnInit {
  protected usuario: UsuarioAuth = buildUsuarioAuth();
  protected emails: Email[] = [];

  constructor(
    private emailService: EmailService,
    private emailState: EmailState,
    private router: Router,
    private messageService: MessageService,
    private authState: AuthStateService
  ) {
    this.authState.usuario.subscribe(usuario => this.usuario = usuario);
    this.emailState.getEmails().subscribe(emails => {
      this.emails = emails;
    });
  }

  ngOnInit(): void {
    if (this.usuario.token) {
      this.carregarEmails();
    }
  }

  carregarEmails(): void {
    if (this.usuario.token) {
      this.emailService.buscarTodos(this.usuario.token).subscribe({
        next: (response) => {
          this.emailState.setEmails(response.emails);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar e-mails.'
          });
        }
      });
    }
  }

  novoEmail(): void {
    this.router.navigate(['/emails/novo']);
  }

  verEmail(email: Email): void {
    this.router.navigate(['/emails/visualizar', email.emailId]);
  }

  responderEmail(email: Email): void {
    this.router.navigate(['/emails/novo'], { state: { emailParaResponder: email } });
  }
}
