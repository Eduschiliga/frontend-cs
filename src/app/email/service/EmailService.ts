import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {EmailCriacao, EmailListaResponse, EmailResponse} from '../model/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly URL = `${environment.apiUrl}/emails`;

  constructor(private http: HttpClient) {
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  enviarEmail(dto: EmailCriacao, token: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(this.URL, dto, {headers: this.getHeaders(token)});
  }

  enviarRascunho(rascunhoId: number, token: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.URL}/${rascunhoId}`, {}, {headers: this.getHeaders(token)});
  }

  buscarPorId(emailId: number, token: string): Observable<EmailResponse> {
    return this.http.put<EmailResponse>(`${this.URL}/${emailId}`, {}, {headers: this.getHeaders(token)});
  }

  buscarTodos(token: string): Observable<EmailListaResponse> {
    return this.http.get<EmailListaResponse>(this.URL, {headers: this.getHeaders(token)});
  }
}
