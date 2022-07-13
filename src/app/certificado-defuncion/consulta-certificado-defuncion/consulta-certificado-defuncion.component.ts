import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-consulta-certificado-defuncion',
  templateUrl: './consulta-certificado-defuncion.component.html',
  styleUrls: ['./consulta-certificado-defuncion.component.css']
})
export class ConsultaCertificadoDefuncionComponent implements OnInit {


  public fechaSelected!: string;
  public page: number = 1;
  public pageSize: number = 15;
  public resultadoTotal: number = 0;
  public dtOptions: DataTables.Settings = {};
  public numitems: number = 15;
  public order: string = 'desc';
 /* public tabla: [] = []; */
    /* obs agrege estas 2 variables para pruebas*/
  fechaDesde: string = "";
  fechaHasta: string = "";
 /* obs agrege esta tabla para poner los datos dummie*/

   tabla=[
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  ];

  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecFecha';
  datosBusqueda: Array<any> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {


  }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
  }

  irNuevoCertificado(){

  }
  irDetalle(extras: any){

  }

  irNuevoRegistro() {
    let params = {}
    this.router.navigate(["nueva-nota"], { queryParams: params, skipLocationChange: true });
  }
  buscar(){

  }
  limpiar(){
    
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
