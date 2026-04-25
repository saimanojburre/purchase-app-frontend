import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    alert('Please login first');
    window.location.href = '/login';
    return false;
  }
};
