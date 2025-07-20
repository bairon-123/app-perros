import { DbTaskService } from 'src/app/services/db-task.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule], 
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';

  constructor(
    private dbService: DbTaskService,
    private router: Router,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async registrar() {
    if (!this.nombre || !this.correo || !this.contrasena) {
      this.mostrarAlerta('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }

    const ok = await this.dbService.registrarUsuario(this.nombre, this.correo, this.contrasena);
    if (ok) {
      this.mostrarAlerta('Registro exitoso', 'Tu cuenta ha sido creada.');
      this.router.navigate(['/login']);
    } else {
      this.mostrarAlerta('Error', 'El correo ya está registrado o hubo un problema.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}
