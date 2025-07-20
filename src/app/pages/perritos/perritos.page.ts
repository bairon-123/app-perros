import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-perritos',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './perritos.page.html',
  styleUrls: ['./perritos.page.scss'],
})
export class PerritosPage {
  imagenUrl: string = '';

  constructor(private http: HttpClient,
              private navCtrl: NavController) {}

  verPerrito() {
    this.http.get<any>('https://dog.ceo/api/breeds/image/random').subscribe(
      res => {
        this.imagenUrl = res.message;
      },
      error => {
        console.error('Error al obtener imagen del perrito', error);
      }
    );
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}
