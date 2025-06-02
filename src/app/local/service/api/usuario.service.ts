import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario, UsuarioResponse} from '../../../auth/model/usuario';
import {MensagemSucesso} from '../../../model/MensagemSucesso';
import {UsuarioAtualizar} from '../../model/usuario-atualizar';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private URL = 'http://localhost:8282/api/usuarios';

  constructor(
    private http: HttpClient
  ) {
  }

  public atualizar(usuario: UsuarioAtualizar, token: string): Observable<UsuarioResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<UsuarioResponse>(`${this.URL}`, usuario, {headers});
  }

  public salvar(usuario: Usuario): Observable<MensagemSucesso> {
    return this.http.post<MensagemSucesso>(`${this.URL}`, usuario);
  }

  public deletar(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(this.URL, {headers});
  }

  public buscarPorId(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL}/${usuarioId}`);
  }
}
