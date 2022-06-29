import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared-modules/services/auth-service.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { VolanteDonacion } from 'src/app/shared-modules/models/volante-donacion.model';
import { VolantesDonacionService } from '../../services/volantes-donacion.service';
import { VolantesDonacion } from 'src/app/trabajo-social/models/volantes-donacion.model';
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-consulta-volantes-donacion',
  templateUrl: './consulta-volantes-donacion.component.html',
  styleUrls: ['./consulta-volantes-donacion.component.css'],
  providers: [DatePipe]
})
export class ConsultaVolantesDonacionComponent implements OnInit, AfterViewInit {
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
  public columnaId: string = 'fecEfec';
  paciente!: pacienteSeleccionado;
  nomPaciente: any;
  rolPaciente: string;
  nssPaciente: string;
  formBuscarArticulos: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private volantesService: VolantesDonacionService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private tarjetaService: AppTarjetaPresentacionService,
  ) {
    this.extras = this.router.getCurrentNavigation()?.extras;
    if (this.extras && this.extras.state) {
      console.log(this.extras.state.id);
      //this.getNotasById(this.extras.state.id);
    }

    this.datesForm = new FormGroup({
      'fechaInicial': new FormControl('', [Validators.required]),
      'fechaFinal': new FormControl('', [Validators.required]),
    }, {updateOn: 'blur'});
  }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    this.paciente = this.tarjetaService.get();
    if (this.paciente !== null && this.paciente !== undefined) {
      this.nssPaciente = this.paciente.nss.toString();
      this.nomPaciente = this.paciente.paciente;
    }
    this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
  }

  ngAfterViewInit(): void {
    $('#volantesInit').val(moment().format('DD/MM/YYYY')).datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.datesForm.get('fechaInicial')?.patchValue(date);
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaInicial')?.patchValue(null);
        }
      }
    });

    $('#volantesFinal').val(moment().format('DD/MM/YYYY')).datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.datesForm.get('fechaFinal')?.patchValue(date);
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaFinal')?.patchValue(null);
        }
      }
    });
  }

  limpiar() {
    this.datesForm.reset();
    this.tabla = [];
  }

  buscar() {
    if (this.datesForm.valid){
      this.getVolantesByFecha();
    }
    else{
      return;
    }
  }

  getVolantesByFecha(): void {
    this.volantesService.getVolantesByFechas(this.datesForm.get('fechaInicial')?.value, this.datesForm.get('fechaFinal')?.value).subscribe(
      (volantes: any) => {
        try {
          if (volantes && volantes.length > 0) {
            this.tabla =  volantes;
            console.log("VOLANTES DONACION: ", this.tabla);
          }
        }catch (error) {
          console.error(error);
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
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

  irDetalle(volanteDonacion: VolanteDonacion) {
    console.log(volanteDonacion);
    let params = {
      'nota': JSON.stringify(volanteDonacion),
    }
    this.router.navigate(["detalle-volante-donacion"], { queryParams: params, skipLocationChange: true });
  }

  irNuevoVolante() {
    //let params = {
    //  'objetoAEnviar': null,
    //}
    this.router.navigate(["nuevo-volante"], {skipLocationChange: true });
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
        val = this.datePipe.transform(val, 'dd/MM/YYYY'); 
        data = moment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = moment(val, 'HH:mm:ss');
        break;

      default:
        break;
    }
    return data;
  }

}
