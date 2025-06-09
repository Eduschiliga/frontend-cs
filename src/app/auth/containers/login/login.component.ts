import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {AuthStateService} from '../../service/state/auth.state.service';
import {AuthApiService} from '../../service/api/auth.api.service';
import {buildUsuarioLogin, Usuario, UsuarioLogin, UsuarioResponse} from '../../model/usuario';
import {Button} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {buildUsuarioAuth, UsuarioAuth} from '../../model/usuario-auth';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    Button,
    ToastModule,
    RouterLink,
    PasswordModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  protected form: UsuarioLogin = buildUsuarioLogin();

  constructor(
    private authState: AuthStateService,
    private authApi: AuthApiService,
    private messageService: MessageService,
    private router: Router,
  ) {
  }

  public login() {

    if (this.form.email != '' && this.form.senha != '') {
      this.authApi.login(this.form).subscribe(
        {
          next: (token) => {
            localStorage.clear();
            localStorage.setItem("token", token.token);

            this.authApi.buscarPorToken(token.token).subscribe(
              {
                next: (response: UsuarioResponse) => {
                  this.messageService.add({severity: 'success', summary: 'Sucesso!', detail: response.mensagem});
                  let usuarioAuth: UsuarioAuth = buildUsuarioAuth();

                  usuarioAuth.nome = response.usuario.nome;
                  usuarioAuth.senha = "";
                  usuarioAuth.token = token.token;
                  usuarioAuth.isAuth = true;
                  usuarioAuth.email = response.usuario.email;

                  this.authState.usuario = usuarioAuth;

                },
                error: (error: HttpErrorResponse) => {
                  this.messageService.add({severity: 'error', summary: error.error.erro, detail: error.error.mensagem});
                },
                complete: () => {
                  this.router.navigate(['/home']);
                }
              }
            );

          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.mensagem});
          },
          complete: () => {
            return;
          }
        }
      );

    } else {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: "Login ou senha inválidos!"});
    }
  }

}
