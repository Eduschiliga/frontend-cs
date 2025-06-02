import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario, UsuarioLogin, UsuarioResponse} from '../../model/usuario';
import {Observable} from 'rxjs';
import {UsuarioAuth} from '../../model/usuario-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly URL_USUARIO = 'http://localhost:8282/api/usuarios';
  private readonly URL_AUTH = 'http://localhost:8282/api/login';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public buscarPorToken(token: string): Observable<UsuarioResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<UsuarioResponse>(this.URL_USUARIO, {headers});
  }

  public login(usuario: UsuarioLogin): Observable<{token: string}> {
    return this.httpClient.post<{token: string}>(this.URL_AUTH, usuario);
  }

}
