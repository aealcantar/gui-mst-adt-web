import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
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
  // public tabla: any[] = [];
  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecFecha';

  public tabla = [
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
    {"fecha":"20/06/2022", "paciente":"Luis Francisco", "medico":"Gumaro eliosa", "trabajadorSocial":"un enferobienX" },
  ]


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

  ngAfterViewInit(): void {
    $('#avisomp').val(moment().format('DD/MM/YYYY')).datepicker({
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
      // this.getNotasByFecha();
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

  irNuevoAvisoMP() {
    let params = {}
    this.router.navigate(["nuevo-aviso-mp"], { queryParams: params, skipLocationChange: true });
  }


  irDetalle(avisoMP: 12) {
    let params = {
      'estudioMedico': JSON.stringify(avisoMP),
    }
    this.router.navigate(["detalle-estudio-medico"], { queryParams: params, skipLocationChange: true });

  }
}
