import { ServiceService } from './busqueda-nss.service';
import { AfterContentInit, Component } from '@angular/core';
import { pacienteSeleccionado } from './paciente.interface';
import { Router } from '@angular/router';
import { AppTarjetaPresentacionService } from '../app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import * as momment from 'moment';
import { AuthService } from '../service/auth-service.service';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';

@Component({
  selector: 'app-busqueda-nss',
  templateUrl: './busqueda-nss.component.html',
  styleUrls: ['./busqueda-nss.component.css']
})

export class BusquedaNssComponent implements AfterContentInit {
  pacienteSeleccionado!: pacienteSeleccionado;

  isCollapsed: boolean[] = [];

  page: number = 1;

  pageSize: number = 15;

  alertMensaje: string = "";
  alertVisible: boolean = false;
  alertTipo: string = "";



  // txtNSS = "4382641109";
  txtNSS = "";

  listaPacientes: any[] = [];

  errorBusqueda: boolean = false;

  resultadoTotal: number = 0;

  order: string = 'desc';
  columnaId: string = 'nss';
  alert!: AlertInfo;

  constructor(
    private ServiceService: ServiceService,
    private router: Router,
    private tarjetaService: AppTarjetaPresentacionService,
    private authService: AuthService
  ) {
    this.authService.userLogged$.next(true);
    this.authService.isAuthenticatedObs$.next(true);
  }

  ngAfterContentInit(): void {
    this.authService.setProjectObs("Trabajo social");
  }

  elementoSeleccionado(elemento: any) {
    this.pacienteSeleccionado = elemento;
    this.tarjetaService.add(this.pacienteSeleccionado);
    this.router.navigate(['consulta-notas'], { skipLocationChange: true });
  }

  muestra(i: number) {
    this.isCollapsed[i] = !this.isCollapsed[i];
  }


  get() {

    if (this.validaInput()) {
      this.muestraAlerta(
        '¡La longitud del NSS no es correcta, favor de verificar!',
        'alert-danger',
        'Error',
      );

    } else {

      this.ServiceService.getAll(this.txtNSS).subscribe({
        next: (resp: any) => {
          this.listaPacientes = resp.busquedanss.beneficiarios;

          this.resultadoTotal = resp.busquedanss.registrosTotal;

          if (this.resultadoTotal == 0) {

            this.errorBusqueda = true;
            this.muestraAlerta(
              'Valide los filtros',
              'alert-warning',
              'Sin resultados',
            );

          } else {
            for (var i = 0; i < this.resultadoTotal; i++) {
              this.isCollapsed[i] = true;
            }
          }

          this.sortBy(this.columnaId, this.order, 'fecha');

        }, error: (err) => {
          this.muestraAlerta(
            'No fue posible conectar con la API de busqueda',
            'alert-danger',
            'Error de red',
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

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
    this.alert = new AlertInfo;
    this.alert = {

      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    };
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      };
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
