import { DbTaskService } from 'src/app/services/db-task.service';
import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    RouterModule,
    IonLabel,
    IonInput,
    IonButton,
    IonCardContent,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';

  constructor(
    private dbService: DbTaskService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async login() {
    if (!this.correo || !this.contrasena) {
      this.mostrarAlerta('Campos requeridos', 'Completa todos los campos.');
      return;
    }

    const usuario = await this.dbService.validarCredenciales(this.correo, this.contrasena);
    if (usuario) {
      localStorage.setItem('usuario_id', usuario.id);
      localStorage.setItem('usuario_activo', 'true'); 
      this.router.navigate(['/home']);
    } else {
      this.mostrarAlerta('Error', 'Credenciales inválidas');
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

  // ✅ Evita warning de accesibilidad (aria-hidden)
  ionViewDidLeave() {
    const el = document.activeElement as HTMLElement;
    if (el) el.blur();
  }
}
