import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario, UsuarioLogin} from '../../model/usuario';
import {Observable} from 'rxjs';
import {UsuarioAuth} from '../../model/usuario-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly URL_USUARIO = 'http://localhost:8080/api/usuario';
  private readonly URL_AUTH = 'http://localhost:8080/api/auth';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public buscarPorToken(token: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.URL_AUTH}/token/${token}`);
  }

  public login(usuario: UsuarioLogin): Observable<{token: string}> {
    return this.httpClient.post<{token: string}>(this.URL_AUTH, usuario);
  }

  public criar(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.URL_USUARIO, usuario);
  }

  public atualizar(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(this.URL_USUARIO, usuario);
  }

  public buscarPorId(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.URL_USUARIO}/${id}`);
  }
}
