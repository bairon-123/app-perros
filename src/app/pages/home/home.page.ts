import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  irAReservas() {
    this.router.navigate(['/reservas']);
  }

  irAServicios() {
    this.router.navigate(['/servicios']);
  }

  irAUbicacion() {
    this.router.navigate(['/ubicacion']);
  }

  irAPerritos() {
    this.router.navigate(['/perritos']);
  }

  irAClima() {
    this.router.navigate(['/clima']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario_id');
    this.router.navigate(['/login']);
  }
}
