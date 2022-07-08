import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlArticulosService } from '../../services/control-articulos.service';
import { InformeServiciosService } from '../../services/informe-servicios.service';
import { AlertInfo } from 'src/app/shared-modules/models/app-alert.interface';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';

@Component({
  selector: 'app-detalle-informe-servicios',
  templateUrl: './detalle-informe-servicios.component.html',
  styleUrls: ['./detalle-informe-servicios.component.css']
})
export class DetalleInformeServiciosComponent implements OnInit {

  //declaracion de variables para el funcionamiento del aplicativo
  detalle: any = {};
  alert!: AlertInfo;
  idControlArticulos: string = '';
  articulosArray: Array<any> = [];
  paciente!: pacienteSeleccionado;

  constructor(
    private controlArticulosService: ControlArticulosService,
    private rutaActiva: ActivatedRoute,
    private tarjetaService: AppTarjetaPresentacionService,
  ) { }

  ngOnInit(): void {
  }
  
  imprimirInforme() {

  }

}
