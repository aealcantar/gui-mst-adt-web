import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
declare var $: any;


@Component({
  selector: 'app-consulta-certificados-defuncion',
  templateUrl: './consulta-certificados-defuncion.component.html',
  styleUrls: ['./consulta-certificados-defuncion.component.css']
})
export class ConsultaCertificadosDefuncionComponent implements OnInit {
	
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
  //public prueba =  [{ "fecFecha": "27/06/2022", "nomAsegurado": "lorem imput dolor sit amen lorem imput dolor sitam", "desNss":"123456789012" }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private Artservice: ControlArticuloService ,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
	 this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
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

  irNuevoControlTsCd() {
   let params = {}
    this.router.navigate(["nuevo-aviso-mp"], { queryParams: params, skipLocationChange: true });
  }
  
  irDetalle(certificadoDefuncion: 12) {
    let params = {
      'certificadoDefuncion': JSON.stringify(certificadoDefuncion),
    }
    this.router.navigate(["detalle-certificado-defuncion"], { queryParams: params, skipLocationChange: true });

  }
  
}
