import { ServiceService } from './busqueda-nss.service';
import { Component } from '@angular/core';
import { pacienteSeleccionado } from './paciente.interface';
import { Router } from '@angular/router';
import { AppTarjetaPresentacionService } from '../app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import * as momment from 'moment';

@Component({
  selector: 'app-busqueda-nss',
  templateUrl: './busqueda-nss.component.html',
  styleUrls: ['./busqueda-nss.component.css']
})

export class BusquedaNssComponent {
  pacienteSeleccionado!: pacienteSeleccionado;

  isCollapsed: boolean[] = [];

  page: number = 1;

  pageSize: number = 15;

  alertMensaje: string = "";
  alertVisible: boolean = false;
  alertTipo: string = "";



  txtNSS = "4382641109";

  listaPacientes: any[] = [];

  errorBusqueda: boolean = false;

  resultadoTotal: number = 0;

  order: string = 'desc';
  columnaId: string = 'nss';

  constructor(
    private ServiceService: ServiceService,
    private router: Router,
    private tarjetaService: AppTarjetaPresentacionService
  ) { }

  elementoSeleccionado(obj: any) {

    this.pacienteSeleccionado = obj;

    this.tarjetaService.add(this.pacienteSeleccionado);

    this.router.navigate(['consulta-notas'], { skipLocationChange: true });
    console.log(this.pacienteSeleccionado)

  }

  muestra(i: number) {
    this.isCollapsed[i] = !this.isCollapsed[i];

  }


  get() {

    if (this.validaInput()) {

      this.muestraAlerta('<strong>Error.</strong>¡La longitud del NSS no es correcta, favor de verificar!',
        'alert-danger', null
      );

    } else {

      this.ServiceService.getAll(this.txtNSS).subscribe({
        next: (resp: any) => {
          this.listaPacientes = resp.busquedanss.beneficiarios;

          this.resultadoTotal = resp.busquedanss.registrosTotal;

          if (this.resultadoTotal == 0) {

            this.errorBusqueda = true;
            this.muestraAlerta('<strong>Sin resultados.</strong> Valide los filtros',
              'alert-warning', null
            );

          } else {
            for (var i = 0; i < this.resultadoTotal; i++) {
              this.isCollapsed[i] = true;
            }
          }

          this.sortBy(this.columnaId, this.order, 'fecha');

        }, error: (err) => {

          this.muestraAlerta('<strong>Error de red.</strong> No fue posible conectar con la API de busqueda',
            'alert-danger', null
          );

          console.log(err)
          this.errorBusqueda = true;


        }
      });

    }


  }

  validaInput(): boolean {

    return this.txtNSS.length != 10;

  }

  limpiar() {
    this.listaPacientes = [];
    this.resultadoTotal = 0;
    this.errorBusqueda = false;
    this.txtNSS = '';
    this.alertVisible = false;
  }

  muestraAlerta(mensaje: string, estilo: string, funxion: any) {

    this.alertMensaje = mensaje;
    this.alertTipo = estilo;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertMensaje = mensaje;
      this.alertTipo = estilo;
      this.alertVisible = false;

      if (funxion != null) {
        funxion();
      }
    }, 5000);
  }

  sortBy(columnaId: string, order: string, type: string) {
    console.log(columnaId, order, type);
    
    this.columnaId = columnaId;
    this.order = order;

    this.listaPacientes.sort((a: any, b: any) => {
      let c: any = this.converType(a[columnaId], type);
      let d: any = this.converType(b[columnaId], type);
      if (order === 'desc') {
        return d - c; // Descendiente
      } else {
        return c - d; // Ascendiente
      }
    });
  }

  converType(val: any, type: string) {
    let data;
    switch (type) {
      case 'fecha':
        data = momment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = momment(val, 'HH:mm:ss');
        break;
      case 'number':
        data = parseInt(val);
        break;

      default:
        break;
    }
    return data;
  }
}
