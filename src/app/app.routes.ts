import { Routes } from '@angular/router';
import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'page1', component: Page1, canActivate: [authGuard] },
      { path: 'page2', component: Page2, canActivate: [authGuard] },
    ],
  },
];
