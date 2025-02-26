import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { URL_STRING } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MenubarModule],
})
export class AppComponent implements OnInit {
  title = 'Kaio';
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/' + URL_STRING.FORM,
      },
      {
        label: 'DWDM',
        icon: 'pi pi-sitemap',
        routerLink: '/' + URL_STRING.DWDM,
      },
    ];
  }
}
