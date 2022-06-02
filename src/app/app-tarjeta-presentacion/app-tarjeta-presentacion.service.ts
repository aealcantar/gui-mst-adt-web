import { Injectable } from '@angular/core';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';

@Injectable({
  providedIn: 'root'
})
export class AppTarjetaPresentacionService {

  paciente!: pacienteSeleccionado;

  add(paciente: pacienteSeleccionado) {

    this.paciente = paciente;

  }

  get(): pacienteSeleccionado {

    return this.paciente;
    
  }
}
