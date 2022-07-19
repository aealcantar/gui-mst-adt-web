import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';

@Injectable({
  providedIn: 'root'
})
export class AppTarjetaPresentacionService {

  paciente!: pacienteSeleccionado;

  add(paciente: pacienteSeleccionado) {
    this.paciente = paciente;
    localStorage.setItem('paciente', JSON.stringify(this.paciente));
  }

  get(): pacienteSeleccionado {
    this.paciente = JSON.parse(localStorage.getItem('paciente'));
    return this.paciente;
  }
}
