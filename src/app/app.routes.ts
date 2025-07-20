import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then((m) => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/reservas/reservas.page').then((m) => m.ReservasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios/servicios.page').then((m) => m.ServiciosPage),
    canActivate: [AuthGuard]
  },
  {
  path: 'ubicacion',
  loadComponent: () => import('./pages/ubicacion/ubicacion.page').then((m) => m.UbicacionPage),
  canActivate: [AuthGuard]
  },
  {
    path: 'perritos',
  loadComponent: () => import('./pages/perritos/perritos.page').then((m) => m.PerritosPage),
  canActivate: [AuthGuard]
  },
  {
     path: 'clima',
  loadComponent: () => import('./pages/clima/clima.page').then(m => m.ClimaPage),
  canActivate: [AuthGuard]
  },
];
