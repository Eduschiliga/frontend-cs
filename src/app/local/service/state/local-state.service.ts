import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Local} from '../../model/local';

@Injectable({
  providedIn: 'root'
})
export class LocalStateService {
  private localList$ = new BehaviorSubject<Local[]>([]);
  public local$ = this.localList$.asObservable();

  public setLocalList(localList: Local[]) {
    this.localList$.next(localList);
  }

  constructor() { }
}
