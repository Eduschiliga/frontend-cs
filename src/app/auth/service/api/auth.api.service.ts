import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UsuarioLogin, UsuarioResponse} from '../../model/usuario';
import {Observable} from 'rxjs';
import {MensagemSucesso} from '../../../model/MensagemSucesso';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly URL_BASE = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public buscarPorToken(token: string): Observable<UsuarioResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<UsuarioResponse>(this.URL_BASE + '/usuarios', {headers});
  }

  public login(usuario: UsuarioLogin): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(this.URL_BASE + "/login", usuario);
  }

  public logout(token: string): Observable<MensagemSucesso> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<MensagemSucesso>(this.URL_BASE + "/logout", {}, {headers});
  }

}
