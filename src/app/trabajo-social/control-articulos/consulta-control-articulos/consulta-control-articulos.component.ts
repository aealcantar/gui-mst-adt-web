import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ControlArticulosService } from '../../services/control-articulos.service';
import { ControlArticulos } from 'src/app/trabajo-social/models/control-articulo.model';
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-consulta-control-articulos',
  templateUrl: './consulta-control-articulos.component.html',
  styleUrls: ['./consulta-control-articulos.component.css'],
  providers: [DatePipe]
})
export class ConsultaControlArticulosComponent implements OnInit {


  public fechaSelected!: string;
  public page: number = 1;
  public pageSize: number = 10;
  public resultadoTotal: number = 0;
  public dtOptions: DataTables.Settings = {};
  public numitems: number = 15;
  public order: string = 'desc';
  public tabla: any[] = [];
  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecha';
  public findCtrolArt: any[] = [];
  public valores: ControlArticulos;
  paciente!: pacienteSeleccionado;
  nomPaciente: any;
  rolPaciente: string;
  nssPaciente: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private Artservice: ControlArticulosService ,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private tarjetaService: AppTarjetaPresentacionService,
  ) {  
    this.datesForm = new FormGroup({
      'fechaInicial': new FormControl(null, [Validators.required]),
      'fechaFinal': new FormControl(null, [Validators.required]),
    }, {updateOn: 'blur'});

  }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    this.paciente = this.tarjetaService.get();
    if (this.paciente !== null && this.paciente !== undefined) {
      this.nssPaciente = this.paciente.nss.toString();
      this.nomPaciente = this.paciente.paciente;
    }
  }

  limpiar() {
    this.datesForm.reset();
    this.tabla = [];
  }

  buscar() {
    if (this.datesForm.valid){
      if(this.datesForm.controls['fechaInicial'].value < this.datesForm.controls['fechaFinal'].value){
        this.getArticulosByFecha();
      }
      else{
        this.tabla = [];
      }
      
    }
    else{
      return;
    }
  }

  getArticulosByFecha(): void {

    const findCtrolArt = {
     "bitacora":[{
         "aplicativo":"control-articulos",
         "flujo":"post",
         "idUsuario":1,
         "nombreUsuario":this.nomPaciente,
         "tipoUsuario":1
     }],
     "fechaInicial": this.datesForm.get('fechaInicial')?.value,
     "fechaFinal": this.datesForm.get('fechaFinal')?.value,
     "clavePaciente": this.nssPaciente
   };

   this.Artservice.getArticulosByFechas(JSON.stringify(findCtrolArt)).subscribe(
       (articulos: any) => {
         console.log("CONTROL DE ARTICULOS: ", articulos);
       try {
         if (articulos) {
           const ariculosJson = articulos.response;
           ariculosJson.status == "OK" ? this.tabla = ariculosJson.listaControlArticulosDto : null;
           console.log("CONTROL DE ARTICULOS: ", this.tabla );
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

  irDetalle(controlArticulos: ControlArticulos) {
    let params = {
      'controlArticulos': JSON.stringify(controlArticulos),
    }
    this.router.navigateByUrl("/detalle-control-articulos/" + controlArticulos.idCa,{ skipLocationChange: true })
  }

  ngAfterViewInit(): void {
    $('#articulosInit').datepicker({
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

    $('#articulosFinal').datepicker({
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

  irNuevoRegistro() {
    let params = {}
    this.router.navigateByUrl("/agregar-control-articulos", { skipLocationChange: true });
  }

  sortBy(columnaId: string, order: string, type: string) {
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
