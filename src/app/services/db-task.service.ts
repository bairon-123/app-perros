import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DbTaskService {
  private db!: SQLiteObject;
  private storageReady = false;

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private storage: Storage
  ) {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        await this.inicializarBD();
      } else {
        await this.storage.create();
        this.storageReady = true;
        console.warn('🧪 Modo navegador: usando Storage');
        await this.insertarUsuarioTest();
      }
    });
  }

  private async esperarBD(): Promise<void> {
    while (!this.db && !this.storageReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async inicializarBD() {
    try {
      this.db = await this.sqlite.create({
        name: 'pelupet2.db',
        location: 'default'
      });

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT NOT NULL UNIQUE,
          contrasena TEXT NOT NULL
        );`, []);

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS reservas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          nombre_perro TEXT,
          tipo_servicio TEXT,
          fecha TEXT,
          hora TEXT,
          raza TEXT,
          tamano TEXT,
          peso REAL,
          indicaciones TEXT,
          FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        );`, []);

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS ubicacion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          direccion TEXT,
          FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        );`, []);

      await this.insertarUsuarioTest();
      console.log('✅ BD lista');
    } catch (error) {
      console.error('❌ Error al inicializar BD:', error);
    }
  }

  async insertarUsuarioTest(): Promise<void> {
    await this.esperarBD();
    try {
      if (this.db) {
        await this.db.executeSql(
          `INSERT OR IGNORE INTO usuarios (nombre, correo, contrasena)
           VALUES (?, ?, ?)`,
          ['Usuario Test', 'bairon@gmail.com', '123456']
        );
      } else {
        const usuarios = (await this.storage.get('usuarios')) || [];
        const existe = usuarios.find((u: any) => u.correo === 'bairon@gmail.com');
        if (!existe) {
          usuarios.push({ id: 1, nombre: 'Usuario Test', correo: 'bairon@gmail.com', contrasena: '123456' });
          await this.storage.set('usuarios', usuarios);
        }
      }
      console.log('🧪 Usuario test insertado');
    } catch (error) {
      console.error('❌ Error test usuario:', error);
    }
  }

  async registrarUsuario(nombre: string, correo: string, contrasena: string): Promise<boolean> {
    await this.esperarBD();
    try {
      if (this.db) {
        await this.db.executeSql(
          'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
          [nombre, correo, contrasena]
        );
      } else {
        const usuarios = (await this.storage.get('usuarios')) || [];
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map((u: any) => u.id)) + 1 : 1;
        usuarios.push({ id: nuevoId, nombre, correo, contrasena });
        await this.storage.set('usuarios', usuarios);
      }
      return true;
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      return false;
    }
  }

  async validarCredenciales(correo: string, contrasena: string): Promise<any> {
    await this.esperarBD();
    try {
      if (this.db) {
        const res = await this.db.executeSql(
          'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
          [correo, contrasena]
        );
        return res.rows.length > 0 ? res.rows.item(0) : null;
      } else {
        const usuarios = (await this.storage.get('usuarios')) || [];
        return usuarios.find((u: any) => u.correo === correo && u.contrasena === contrasena) || null;
      }
    } catch (error) {
      console.error('❌ Error validar credenciales:', error);
      return null;
    }
  }

  async validarCredencialesById(usuario_id: number): Promise<any> {
    await this.esperarBD();
    try {
      if (this.db) {
        const res = await this.db.executeSql(
          'SELECT * FROM usuarios WHERE id = ?',
          [usuario_id]
        );
        return res.rows.length > 0 ? res.rows.item(0) : null;
      } else {
        const usuarios = (await this.storage.get('usuarios')) || [];
        return usuarios.find((u: any) => u.id === usuario_id) || null;
      }
    } catch (error) {
      console.error('❌ Error buscar usuario por ID:', error);
      return null;
    }
  }

  async guardarReserva(
    usuario_id: number,
    nombre_perro: string,
    tipo_servicio: string,
    fecha: string,
    hora: string,
    raza: string,
    tamano: string,
    peso: number,
    indicaciones: string
  ): Promise<boolean> {
    await this.esperarBD();
    try {
      if (this.db) {
        await this.db.executeSql(`
          INSERT INTO reservas 
            (usuario_id, nombre_perro, tipo_servicio, fecha, hora, raza, tamano, peso, indicaciones)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [usuario_id, nombre_perro, tipo_servicio, fecha, hora, raza, tamano, peso, indicaciones]
        );
      } else {
        const reservas = (await this.storage.get('reservas')) || [];
        const nuevoId = reservas.length > 0 ? Math.max(...reservas.map((r: any) => r.id)) + 1 : 1;
        reservas.push({ id: nuevoId, usuario_id, nombre_perro, tipo_servicio, fecha, hora, raza, tamano, peso, indicaciones });
        await this.storage.set('reservas', reservas);
      }
      return true;
    } catch (error) {
      console.error('❌ Error al guardar reserva:', error);
      return false;
    }
  }

  async obtenerReservasPorUsuario(usuario_id: number): Promise<any[]> {
    await this.esperarBD();
    try {
      if (this.db) {
        const res = await this.db.executeSql(
          'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY id DESC',
          [usuario_id]
        );
        const reservas = [];
        for (let i = 0; i < res.rows.length; i++) {
          reservas.push(res.rows.item(i));
        }
        return reservas;
      } else {
        const reservas = (await this.storage.get('reservas')) || [];
        return reservas.filter((r: any) => r.usuario_id === usuario_id).reverse();
      }
    } catch (error) {
      console.error('❌ Error obtener reservas:', error);
      return [];
    }
  }

  async guardarUbicacion(usuario_id: number, direccion: string): Promise<boolean> {
    await this.esperarBD();
    try {
      if (this.db) {
        await this.db.executeSql(
          'INSERT INTO ubicacion (usuario_id, direccion) VALUES (?, ?)',
          [usuario_id, direccion]
        );
      } else {
        const ubicaciones = (await this.storage.get('ubicaciones')) || [];
        const nuevoId = ubicaciones.length > 0 ? Math.max(...ubicaciones.map((u: any) => u.id)) + 1 : 1;
        ubicaciones.push({ id: nuevoId, usuario_id, direccion });
        await this.storage.set('ubicaciones', ubicaciones);
      }
      return true;
    } catch (error) {
      console.error('❌ Error guardar ubicación:', error);
      return false;
    }
  }

  async obtenerUbicacion(usuario_id: number): Promise<string | null> {
    await this.esperarBD();
    try {
      if (this.db) {
        const res = await this.db.executeSql(
          'SELECT direccion FROM ubicacion WHERE usuario_id = ? ORDER BY id DESC LIMIT 1',
          [usuario_id]
        );
        return res.rows.length > 0 ? res.rows.item(0).direccion : null;
      } else {
        const ubicaciones = (await this.storage.get('ubicaciones')) || [];
        const ultima = ubicaciones.filter((u: any) => u.usuario_id === usuario_id).pop();
        return ultima ? ultima.direccion : null;
      }
    } catch (error) {
      console.error('❌ Error obtener ubicación:', error);
      return null;
    }
  }
}
