import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EstudioSocialMedicoService } from '../service/estudio-social-medico.service';
import { EstudioMedico } from '../models/estudio-medico.model';
import { HttpErrorResponse } from '@angular/common/http';
import * as momment from 'moment';
import { DatePipe } from '@angular/common';
import { AlertInfo } from '../app-alerts/app-alert.interface';
declare var $: any;

@Component({
  selector: 'app-consulta-estudios-medicos',
  templateUrl: './consulta-estudios-medicos.component.html',
  styleUrls: ['./consulta-estudios-medicos.component.css'],
  providers: [DatePipe]
})
export class ConsultaEstudiosMedicosComponent implements OnInit {

  estudioMedicos: EstudioMedico[] = [];
  fechaSelected!: string;
  page: number = 1;
  pageSize: number = 15;
  resultadoTotal: number = 0;
  dtOptions: DataTables.Settings = {};
  numitems: number = 15;
  order: string = 'desc';
  columnaId: string = 'fecFecha';
  alert!: AlertInfo;

  public datesForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private estudioMedicoService: EstudioSocialMedicoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
    setTimeout(() => {
      this.authService.setProjectObs("Trabajo Social");
    }, 0);
  }

  ngAfterViewInit(): void {
    $('#calendarCESM1').datepicker({
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

    $('#calendarCESM2').datepicker({
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

  loadDataTable(): void {
    this.estudioMedicos = [];
    this.estudioMedicoService.getEstudiosMedicosByFechas(this.datesForm.get('fechaInicial')!.value, this.datesForm.get('fechaFinal')!.value).subscribe(
      (estudiosMedicosSociales: any) => {
        this.estudioMedicos = estudiosMedicosSociales;
        console.log("ESTUDIOS MEDICOS: ", this.estudioMedicos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    ).add( ()=>{
      if(this.estudioMedicos.length == 0){
        this.muestraAlerta(
          'Verifique los filtros',
          'alert-warning',
          'Sin resultados',
        );
      }
    });
    this.dtOptions = {
      order: [[2, 'desc']],
      ordering: false,
      paging: false,
      processing: false,
      info: false,
      searching: false,
    };
    this.sortBy(this.columnaId, this.order, 'fecha');
  }

  irDetalle(estudioMedico: EstudioMedico) {
    let params = {
      'estudioMedico': JSON.stringify(estudioMedico),
    }
    this.router.navigate(["detalle-estudio-medico"], { queryParams: params, skipLocationChange: true });

  }

  irNuevoEstudio() {
    this.router.navigate(["nuevo-estudio-social-medico"]);
  }

  handleDatesChange() {
    if (
      this.datesForm.get('fechaInicial')?.value &&
      this.datesForm.get('fechaInicial')?.value !== '' &&
      this.datesForm.get('fechaFinal')?.value &&
      this.datesForm.get('fechaFinal')?.value !== '') {
      this.loadDataTable();
    }
  }

  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId;
    this.order = order;

    this.estudioMedicos.sort((a: any, b: any) => {
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
        val = this.datePipe.transform(val, 'dd/MM/YYYY'); 
        data = momment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = momment(val, 'HH:mm:ss');
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
