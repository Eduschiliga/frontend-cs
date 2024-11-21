import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {buildLocal, Local} from '../model/local';
import {LocalApiService} from '../service/api/local-api.service';

@Injectable({
  providedIn: 'root'
})
export class LocalResolver implements Resolve<Local | undefined> {
  constructor(
    private localService: LocalApiService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Local | undefined> {
    const id = parseInt(route.params['id']);
    if (route.params && route.params['id']) {
      return this.localService.buscarPorId(id);
    }

    return of(buildLocal());
  }
}
