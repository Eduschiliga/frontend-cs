import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario} from '../auth/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private URL = 'http://localhost:8080/api/usuario';

  constructor(
    private http: HttpClient
  ) {
  }

  public atualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.URL}`, usuario);
  }

  public salvar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.URL}`, usuario);
  }

  public deletar(usuarioId: number) {
    return this.http.delete<void>(`${this.URL}/${usuarioId}`);
  }

  public buscarPorId(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL}/${usuarioId}`);
  }
}
