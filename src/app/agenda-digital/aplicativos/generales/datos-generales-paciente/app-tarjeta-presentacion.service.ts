import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pacienteSeleccionado } from '../../models/paciente.interface'; 

@Injectable({
  providedIn: 'root'
})
export class AppTarjetaPresentacionService {

  paciente!: pacienteSeleccionado;

  add(paciente: pacienteSeleccionado) {
    this.paciente = paciente;
    localStorage.setItem('paciente', JSON.stringify(this.paciente));
    console.log("PACIENTE: ", this.paciente);
  }

  get(): pacienteSeleccionado {
    return this.paciente;
  }
}
