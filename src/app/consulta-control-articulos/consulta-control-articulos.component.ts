import { ControlArticulos } from './../models/control-articulo.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlArticuloService } from '../service/control-articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { AlertInfo } from '../app-alerts/app-alert.interface';
import { AuthService } from '../service/auth-service.service';

declare var $: any;

@Component({
  selector: 'app-consulta-control-articulos',
  templateUrl: './consulta-control-articulos.component.html',
  styleUrls: ['./consulta-control-articulos.component.css']
})
export class ConsultaControlArticulosComponent implements OnInit {


  public fechaSelected!: string;
  public page: number = 1;
  public pageSize: number = 15;
  public resultadoTotal: number = 0;
  public dtOptions: DataTables.Settings = {};
  public numitems: number = 15;
  public order: string = 'desc';
  public tabla: any[] = [];
  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecFecha';
  public alert!: AlertInfo;

  constructor(
    private router: Router,
    private authService: AuthService,
    private Artservice: ControlArticuloService,
    private fb: FormBuilder,
  ) {


  }

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.setProjectObs("Trabajo Social");
    }, 0);
    this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
  }

  getNotasById(id: number) {
    this.Artservice.getArticuloById(id).subscribe(
      (res) => {
        console.log(res);
        this.tabla = res;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  getNotasByFecha() {
    this.Artservice.getArticulosByFechas(this.datesForm.get('fechaInicial')?.value, this.datesForm.get('fechaFinal')?.value).subscribe(
      (res) => {
        if (res && res.listaControlArticulosDto.length > 0) {
          this.tabla = res.listaControlArticulosDto;
        } else if (res && res.listaControlArticulosDto.length === 0) {
          this.muestraAlerta(
            'Verifique los filtros',
            'alert-warning',
            'Sin resultados',
          );
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    ).add(() => {
      if (this.tabla.length == 0) {
        this.muestraAlerta(
          'Verifique los filtros',
          'alert-warning',
          'Sin resultados',
        );
      }
    });
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

  ngAfterViewInit(): void {
    $('#notasInit').val(moment().format('DD/MM/YYYY')).datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.datesForm.get('fechaInicial')?.patchValue(date);
          this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaInicial')?.patchValue(null);
        }
      }
    });

    $('#notasFinal').val(moment().format('DD/MM/YYYY')).datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.datesForm.get('fechaFinal')?.patchValue(date);
          this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaFinal')?.patchValue(null);
        }
      }
    });
    this.handleDatesChange();
  }

  handleDatesChange() {
    if (
      this.datesForm.get('fechaInicial')?.value &&
      this.datesForm.get('fechaInicial')?.value !== '' &&
      this.datesForm.get('fechaFinal')?.value &&
      this.datesForm.get('fechaFinal')?.value !== '') {
      this.getNotasByFecha();
    }
  }


  irNuevoRegistro() {
    let params = {}
    this.router.navigate(["nueva-nota"], { queryParams: params, skipLocationChange: true });
  }

  sortBy(columnaId: string, order: string, type: string) {
    console.log(columnaId, order, type);

    this.columnaId = columnaId;
    this.order = order;

    this.tabla.sort((a: any, b: any) => {
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
        data = moment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = moment(val, 'HH:mm:ss');
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
