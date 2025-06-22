import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MensagemSucesso } from '../../../model/MensagemSucesso';
import {Rascunho, RascunhoListaResponse, RascunhoResponse} from '../../model/rascunho.model';

@Injectable({
  providedIn: 'root'
})
export class RascunhoService {
  private readonly URL = `${environment.apiUrl}/rascunhos`;

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public buscarTodos(token: string): Observable<RascunhoListaResponse> {
    return this.http.get<RascunhoListaResponse>(this.URL, { headers: this.getHeaders(token) });
  }

  public buscarPorId(id: number, token: string): Observable<RascunhoResponse> {
    return this.http.get<RascunhoResponse>(`${this.URL}/${id}`, { headers: this.getHeaders(token) });
  }

  public criar(rascunho: Rascunho, token: string): Observable<RascunhoResponse> {
    return this.http.post<RascunhoResponse>(this.URL, rascunho, { headers: this.getHeaders(token) });
  }

  public atualizar(rascunho: Rascunho, token: string): Observable<RascunhoResponse> {
    return this.http.put<RascunhoResponse>(this.URL + "/" + rascunho.rascunhoId, rascunho, { headers: this.getHeaders(token) });
  }

  public deletar(id: number, token: string): Observable<MensagemSucesso> {
    return this.http.delete<MensagemSucesso>(`${this.URL}/${id}`, { headers: this.getHeaders(token) });
  }
}
