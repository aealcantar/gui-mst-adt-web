import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvisoMinisterioPublicoService } from 'src/app/service/aviso-mp.service';
import { AvisoMP } from '../models/aviso-mp.model';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
declare var $: any;

@Component({
  selector: 'app-consulta-aviso-mp',
  templateUrl: './consulta-aviso-mp.component.html',
  styleUrls: ['./consulta-aviso-mp.component.css']
})
export class ConsultaAvisoMpComponent implements OnInit {

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
    private route: ActivatedRoute,
    private avisoMinisterioPublicoService: AvisoMinisterioPublicoService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    $('#avisosInit').datepicker({
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

    $('#avisosFinal').datepicker({
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
      this.getAvisosByFecha();
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

  getAvisosById(id: number) {
    this.avisoMinisterioPublicoService.getAvisoById(id).subscribe(
      (res) => {
        console.log(res);
        this.tabla = res;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  getAvisosByFecha() {
    this.tabla = [];
    this.avisoMinisterioPublicoService.getAvisosByFechas(this.datesForm.get('fechaInicial')?.value, this.datesForm.get('fechaFinal')?.value).subscribe(
      (res) => {
        this.tabla = res.datosAvisosMp;
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

  irNuevoAvisoMP() {
    let params = {}
    this.router.navigate(["nuevo-aviso-mp"], { queryParams: params, skipLocationChange: true });
  }


  irDetalle(idAvisoMp: number) {
    let params = { idAvisoMp };    
    this.router.navigate(["detalle-aviso-mp"], { queryParams: params, skipLocationChange: true });
  }
}
