import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('usuario_id');

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};