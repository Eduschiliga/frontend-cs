import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {AuthStateService} from '../../service/state/auth.state.service';
import {AuthApiService} from '../../service/api/auth.api.service';
import {buildUsuarioLogin, Usuario, UsuarioLogin} from '../../model/usuario';
import {Button} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {buildUsuarioAuth, UsuarioAuth} from '../../model/usuario-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    Button,
    ToastModule,
    RouterLink
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
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  public login() {

    if (this.form.login != '' && this.form.senha != '') {
      this.authApi.login(this.form).subscribe(
        {
          next: (token) => {
            localStorage.clear();
            localStorage.setItem("token", token.token);

            this.authApi.buscarPorToken(token.token).subscribe(
              {
                next: (usuario: Usuario) => {
                  let usuarioAuth: UsuarioAuth = buildUsuarioAuth();

                  usuarioAuth.login = usuario.login;
                  usuarioAuth.senha = "";
                  usuarioAuth.token = token.token;
                  usuarioAuth.isAuth = true;
                  usuarioAuth.usuarioId = usuario.usuarioId;
                  usuarioAuth.email = usuario.email;
                  usuarioAuth.nomeCompleto = usuario.nomeCompleto;

                  this.authState.usuario = usuarioAuth;

                },
                complete: () => {
                  this.router.navigate(['/home']);
                }
              }
            );

          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: error.message});
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
