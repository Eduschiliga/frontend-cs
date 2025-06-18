import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Email} from '../model/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailState {
  private emails$ = new BehaviorSubject<Email[]>([]);

  public getEmails(): Observable<Email[]> {
    return this.emails$.asObservable();
  }

  public setEmails(emails: Email[]): void {
    this.emails$.next(emails);
  }
}
