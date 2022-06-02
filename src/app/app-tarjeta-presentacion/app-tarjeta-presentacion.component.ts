import { Component, Input, OnInit } from '@angular/core';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
import { AppTarjetaPresentacionService } from './../app-tarjeta-presentacion/app-tarjeta-presentacion.service';


@Component({
  selector: 'app-tarjeta-presentacion',
  templateUrl: './app-tarjeta-presentacion.component.html',
  styleUrls: ['./app-tarjeta-presentacion.component.css']
})
export class AppTarjetaPresentacionComponent implements OnInit {

  paciente!: pacienteSeleccionado;
  isCollapsed: boolean=true;

  constructor(private tarjetaServce: AppTarjetaPresentacionService) { }

  ngOnInit(): void {

    this.paciente = this.tarjetaServce.get();

  }

}
