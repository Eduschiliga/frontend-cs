import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {buildUsuarioAuth, UsuarioAuth} from '../../model/usuario-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private _usuario$: BehaviorSubject<UsuarioAuth> = new BehaviorSubject<UsuarioAuth>(buildUsuarioAuth());
  public usuario$ = this._usuario$.asObservable();

  constructor() {
  }

  public set usuario(usuario: UsuarioAuth) {
    this._usuario$.next(usuario);
  }

  public apagarUsuario() {
    this._usuario$.next(buildUsuarioAuth());
  }

  public get usuario(): Observable<UsuarioAuth> {
    return this.usuario$;
  }

  public isAuth(): boolean {
    const usuario = this._usuario$.getValue();
    return usuario && usuario.isAuth;
  }
}
