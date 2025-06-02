import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthApiService} from '../service/api/auth.api.service';
import {AuthStateService} from '../service/state/auth.state.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private authStateUsuario: AuthStateService
  ) {
  }

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      this.router.navigate(['/login']).then();
      return of(false);
    }

    return this.authApi.buscarPorToken(token).pipe(
      map((response) => {
        this.authStateUsuario.usuario = {
          email: response.usuario.email,
          senha: '',
          token: token,
          isAuth: true,
          nome: response.usuario.nome,
        };
        return true;
      }),
      catchError(() => {
        localStorage.clear();
        this.router.navigate(['/login']).then();
        return of(false);
      })
    );
  }
}
