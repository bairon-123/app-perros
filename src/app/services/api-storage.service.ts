import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiStorageService {
  private apiKey = 'TU_API_KEY'; // 🔑 reemplaza con tu propia API Key
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }


  geocodificarDireccion(direccion: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
    return this.http.get<any[]>(url); 
  }
  // ✅ Consumir API externa del clima
  getClima(ciudad: string) {
    const url = `${this.apiUrl}?q=${ciudad}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get(url);
  }

  // ✅ Guardar dirección localmente
  async guardarDireccion(direccion: string): Promise<void> {
    await this.storage.set('direccion_usuario', direccion);
  }

  // ✅ Obtener dirección guardada
  async obtenerDireccion(): Promise<string | null> {
    return await this.storage.get('direccion_usuario');
  }

  // ✅ Eliminar dirección
  async eliminarDireccion(): Promise<void> {
    await this.storage.remove('direccion_usuario');
  }
}
