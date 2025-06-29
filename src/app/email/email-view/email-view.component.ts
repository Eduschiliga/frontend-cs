import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {Email} from '../model/email.model';

@Component({
  selector: 'app-email-view',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, CardModule],
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.css']
})
export class EmailViewComponent implements OnInit {
  email: Email | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.email = data['email'];


      if (this.email?.corpo != null || this.email?.corpo != undefined) {
        this.email.corpo = '<p>' + this.email?.corpo + '</p>'
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/emails']);
  }
}
