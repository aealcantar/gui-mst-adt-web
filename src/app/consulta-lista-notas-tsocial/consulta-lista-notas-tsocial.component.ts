import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth-service.service';
import { NotasService } from 'src/app/service/notas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Nota } from '../models/notas.model';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import { isEmpty } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-consulta-lista-notas-tsocial',
  templateUrl: './consulta-lista-notas-tsocial.component.html',
  styleUrls: ['./consulta-lista-notas-tsocial.component.css']
})
export class ConsultaListaNotasTSocialComponent implements OnInit, AfterViewInit {
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
  alert!: AlertInfo;
  errorBusqueda: boolean = false;
  // tabla = [{ "Fecha": "20/06/2022", "Descripcion": "lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput", }];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notasService: NotasService,
    private fb: FormBuilder,
  ) {
    this.extras = this.router.getCurrentNavigation()?.extras;
    if (this.extras && this.extras.state) {
      console.log(this.extras.state.id);
      this.getNotasById(this.extras.state.id);
    }
  }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
  }

  getNotasById(id: number) {
    this.notasService.getNotasById(id).subscribe(
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
    this.tabla = [];
    this.notasService.getNotasByFechas(this.datesForm.get('fechaInicial')?.value, this.datesForm.get('fechaFinal')?.value).subscribe(
      (res) => {
        this.tabla = res;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
      ).add( ()=>{
        if(this.tabla.length  == 0){
          debugger
          this.muestraAlerta(
            'Verifique los filtros',
            'alert-warning',
            'Sin resultados',
          );
        }
      });
    // }
  }

  ngAfterViewInit(): void {
    $('#notasInit').datepicker({
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

    $('#notasFinal').datepicker({
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

  irDetalle(nota: Nota) {
    console.log(nota);
    let params = {
      'nota': JSON.stringify(nota),
    }
    this.router.navigate(["detalle-nota"], { queryParams: params, skipLocationChange: true });
  }

  irNuevaNota() {
    let params = { }
    this.router.navigate(["nueva-nota"], { queryParams: params, skipLocationChange: true });
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
}
