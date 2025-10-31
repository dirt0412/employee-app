import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header style="background:white;border-bottom:1px solid #e5e7eb;">
      <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <a routerLink="/" class="link" style="font-weight:700;font-size:18px;text-decoration:none;">Angular Employee App</a>
        <nav style="display:flex;gap:12px;">
          <a routerLink="/employees" class="link">Employees</a>
         
        </nav>
      </div>
    </header>
    <main class="container" style="padding-top:16px;">
      <router-outlet></router-outlet>
    </main>
  `
  //  <a routerLink="/employees/new" class="link">Add</a>
})
export class AppComponent {}
