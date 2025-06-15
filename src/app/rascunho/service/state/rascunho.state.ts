import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Rascunho} from '../../model/rascunho.model';

@Injectable({
  providedIn: 'root'
})
export class RascunhoState {
  private rascunhos$ = new BehaviorSubject<Rascunho[]>([]);

  public getRascunhos(): Observable<Rascunho[]> {
    return this.rascunhos$.asObservable();
  }

  public setRascunhos(rascunhos: Rascunho[]): void {
    this.rascunhos$.next(rascunhos);
  }
}
