import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnInit {
  temperatura: number | null = null;
  ciudad = 'Santiago';
  cargando = false;
  error = '';

  constructor(private http: HttpClient,
              private navCtrl: NavController) {}

  ngOnInit() {
    this.obtenerClima();
  }

  obtenerClima() {
    this.cargando = true;
    this.error = '';

    this.http.get<any>(
      'https://api.open-meteo.com/v1/forecast?latitude=-33.45&longitude=-70.67&current_weather=true'
    ).subscribe(
      (data) => {
        this.temperatura = data.current_weather.temperature;
        this.cargando = false;
      },
      (err) => {
        this.error = 'No se pudo obtener el clima';
        this.cargando = false;
      }
    );
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}
