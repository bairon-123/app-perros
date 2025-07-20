import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbTaskService } from 'src/app/services/db-task.service';
import { NavController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservas',
  standalone: true,
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonDatetime
  ]
})
export class ReservasPage implements OnInit {
  nombrePerro = '';
  raza = '';
  tamano = 'Pequeño';
  tipoServicio = 'Express';
  peso: number | null = null;
  indicaciones = '';
  fechaHora = '';
  minDate = new Date().toISOString();
  usuarioId: number | null = null;

  constructor(
    private dbService: DbTaskService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const id = localStorage.getItem('usuario_id');
    this.usuarioId = id ? parseInt(id, 10) : null;
  }

  async guardarReserva() {
    try {
      if (
        !this.usuarioId ||
        !this.nombrePerro.trim() ||
        !this.raza.trim() ||
        !this.tamano ||
        !this.tipoServicio ||
        !this.peso ||
        !this.fechaHora
      ) {
        this.mostrarToast('Completa todos los campos obligatorios');
        return;
      }

      const [fecha, hora] = this.fechaHora.split('T');

      const ok = await this.dbService.guardarReserva(
        this.usuarioId,
        this.nombrePerro.trim(),
        this.tipoServicio,
        fecha,
        hora,
        this.raza.trim(),
        this.tamano,
        this.peso,
        this.indicaciones.trim()
      );

      if (ok) {
        this.mostrarToast('✅ Reserva guardada');
        this.limpiarCampos();
      } else {
        this.mostrarToast('❌ Error al guardar');
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      this.mostrarToast('❌ Error inesperado al guardar');
    }
  }

  limpiarCampos() {
    this.nombrePerro = '';
    this.raza = '';
    this.tamano = 'Pequeño';
    this.tipoServicio = 'Express';
    this.peso = null;
    this.indicaciones = '';
    this.fechaHora = '';
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}



