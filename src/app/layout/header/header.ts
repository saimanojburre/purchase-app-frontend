import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Purchase } from '../../services/purchase';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router: Router,
    private purchaseService: Purchase,
  ) {}

  logout() {
    localStorage.removeItem('token');
    this.purchaseService.clearCache();
    this.router.navigate(['/login']);
  }
}
