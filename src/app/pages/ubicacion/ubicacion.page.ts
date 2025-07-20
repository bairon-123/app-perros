import { Component, OnInit } from '@angular/core';
import { ApiStorageService } from 'src/app/services/api-storage.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {
  direccion: string = '';
  direccionGuardada: string | null = null;
  mapa: L.Map | null = null;

  constructor(
    private apiStorage: ApiStorageService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.direccionGuardada = await this.apiStorage.obtenerDireccion();

    if (this.direccionGuardada) {
      this.geocodificarYMostrar(this.direccionGuardada);
    }
  }

  async guardarDireccion() {
    if (!this.direccion.trim()) {
      this.mostrarAlerta('Por favor, ingresa una dirección válida');
      return;
    }

    await this.apiStorage.guardarDireccion(this.direccion);
    this.direccionGuardada = this.direccion;
    this.direccion = '';

    this.mostrarAlerta('Dirección guardada exitosamente');
    this.geocodificarYMostrar(this.direccionGuardada);
  }

  geocodificarYMostrar(direccion: string) {
    this.apiStorage.geocodificarDireccion(direccion).subscribe((data: any[]) => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        this.mostrarMapa(lat, lon);
      } else {
        console.error('❌ Dirección no encontrada en Nominatim');
      }
    });
  }

  mostrarMapa(lat: number, lon: number) {
    // Eliminar mapa previo si existe
    if (this.mapa) {
      this.mapa.remove();
    }

    this.mapa = L.map('mapa').setView([lat, lon], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mapa);

    L.marker([lat, lon]).addTo(this.mapa).bindPopup('Tu ubicación').openPopup();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}
