import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import * as momment from 'moment';
import { ControlArticuloService } from '../service/control-articulo.service';
import { ControlArticulos } from './../models/control-articulo.model';
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
  public pageSize: number = 15;
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private Artservice: ControlArticuloService ,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
    this.authService.project$.next("Trabajo Social");
  }

  getArticuloById(id: number) {
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


  getArticulos(): void {
    this.Artservice.getArticulos().subscribe(
      (articulos:any) => {
        if (articulos && articulos.List.length > 0) {
          this.tabla = articulos.List;
          console.log("CONTROL DE ARTICULOS: ", this.tabla);
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }
  
  getArticulosByFecha(): void {

     const findCtrolArt = {
      "bitacora":[{
          "aplicativo":"",
          "flujo":"",
          "idUsuario":1,
          "nombreUsuario":"",
          "tipoUsuario":1
      }],
      "pagina":"1",
      "fechaInicial": this.datesForm.get('fechaInicial')?.value,
      "fechaFinal": this.datesForm.get('fechaFinal')?.value,
      "clavePaciente":123456789
    };
  
    this.Artservice.getArticulosByFechas(JSON.stringify(findCtrolArt)).subscribe(
        (articulos: any) => {
          console.log("CONTROL DE ARTICULOS: ", articulos);
          debugger
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
   // this.router.navigate(["detalle-estudio-medico"], { queryParams: params, skipLocationChange: true });
    this.router.navigateByUrl("/detalle-control-articulos/" + controlArticulos.idCa)
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
      this.getArticulosByFecha();
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
