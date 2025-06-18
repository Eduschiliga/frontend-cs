import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Email} from '../model/email.model';
import {EmailService} from '../service/EmailService';

@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<Email> {

  constructor(private emailService: EmailService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Email> {
    const id = route.params['id'];
    const token = localStorage.getItem('token') || '';

    if (id) {
      return this.emailService.buscarPorId(Number(id), token).pipe(
        map(response => response.email)
      );
    }
    return of({assunto: '', emailDestinatario: '', corpo: ''});
  }
}
