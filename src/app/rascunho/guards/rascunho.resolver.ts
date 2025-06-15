import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import {Rascunho} from '../model/rascunho.model';
import {RascunhoService} from '../service/api/rascunho.service';

@Injectable({
  providedIn: 'root'
})
export class RascunhoResolver implements Resolve<Rascunho> {

  constructor(private rascunhoService: RascunhoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Rascunho> {
    const id = route.params['id'];
    const token = localStorage.getItem('token') || '';

    console.log(token)

    if (id) {
      console.log("token")
      console.log(token)

      return this.rascunhoService.buscarPorId(Number(id), token).pipe(
        map(response => response.rascunho)
      );
    }
    return of({
      assunto: '',
      emailDestinatario: '',
      corpo: ''
    });
  }
}
