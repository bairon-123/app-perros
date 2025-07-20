import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbTaskService } from 'src/app/services/db-task.service';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  nombre: string = '';
  correo: string = '';
  direccion: string | null = null;
  reservas: any[] = [];

  constructor(private dbService: DbTaskService,
              private navCtrl: NavController) {}

  async ngOnInit() {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      console.error('❌ No hay sesión activa');
      return;
    }

    const id = parseInt(usuarioId, 10);

    // Obtener datos del usuario
    const usuario = await this.dbService.validarCredencialesById(id);
    if (usuario) {
      this.nombre = usuario.nombre;
      this.correo = usuario.correo;
    } else {
      console.error('❌ Usuario no encontrado');
    }

    // Obtener dirección
    this.direccion = await this.dbService.obtenerUbicacion(id);

    // Obtener reservas
    this.reservas = await this.dbService.obtenerReservasPorUsuario(id);
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}