import { Injectable } from '@angular/core';
import { pacienteSeleccionado } from '../models/paciente.interface';

@Injectable({
  providedIn: 'root'
})
export class DatosGeneralesPacienteServiceService {
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
