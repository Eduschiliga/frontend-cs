import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {buildUsuario, Usuario} from '../../model/usuario';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {UsuarioService} from '../../../local/service/api/usuario.service';
import {MensagemSucesso} from '../../../model/MensagemSucesso';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-cadastro',
  imports: [
    Button,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    RouterLink,
    PasswordModule
  ],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  protected form: Usuario = buildUsuario();

  constructor(
    private usuarioApi: UsuarioService,
    private messageService: MessageService,
    private router: Router,
  ) {
  }

  public login() {

    if (this.form.nome != '' && this.form.senha != '' && this.form.email != '') {
      this.usuarioApi.salvar(this.form).subscribe(
        {
          next: (msg: MensagemSucesso) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: msg.mensagem
            });
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
          },
          complete: () => {
            this.router.navigate(['/']).then();
            return;
          }
        }
      );

    } else {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: "Campos inválidos!"});
    }
  }

}
