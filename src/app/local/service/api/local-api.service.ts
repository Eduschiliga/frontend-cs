import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Local} from '../../model/local';

@Injectable({
  providedIn: 'root'
})
export class LocalApiService {
  private readonly URL = 'http://localhost:8080/api/local';
  private readonly URL_MEDICAO = 'http://localhost:8080/api/medicao';
  private token: string = localStorage.getItem('token') != null ? <string>localStorage.getItem('token') : '';

  constructor(
    private http: HttpClient,
  ) {
  }

  public buscarTodosPorUsuario(usuarioId: number): Observable<Local[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.get<Local[]>(`${this.URL}/usuario/${usuarioId}`, {
      headers: headers
    });
  }

  public buscarPorId(id: number): Observable<Local> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });


    return this.http.get<Local>(`${this.URL}/${id}`, {headers})
  }

  public salvar(local: Local, emailUsuario: string): Observable<Local> {
    console.log(local)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'emailUsuario': emailUsuario
    });

    return this.http.post<Local>(`${this.URL}`, local, {headers});
  }

  public deletar(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete<void>(`${this.URL}/${id}`, {headers});
  }

  public editar(local: Local): Observable<Local> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.put<Local>(`${this.URL}`, local, {headers});
  }

  public deletarMedicao(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete<void>(`${this.URL_MEDICAO}/${id}`, {headers});
  }
}
