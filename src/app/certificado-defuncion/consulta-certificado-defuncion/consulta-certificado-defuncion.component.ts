import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';

declare var $: any;
@Component({
  selector: 'app-consulta-certificado-defuncion',
  templateUrl: './consulta-certificado-defuncion.component.html',
  styleUrls: ['./consulta-certificado-defuncion.component.css'],
})
export class ConsultaCertificadoDefuncionComponent
  implements OnInit, AfterViewInit
{
  formAdd;
  validarCampos: boolean = false;
  public fechaSelected!: string;
  public page: number = 1;
  public pageSize: number = 15;
  public resultadoTotal: number = 0;
  public dtOptions: DataTables.Settings = {};
  public numitems: number = 15;
  public order: string = 'desc';
  public tabla: [] = [];
  /* obs agrege estas 2 variables para pruebas*/
  fechaDesde: string = '';
  fechaHasta: string = '';
  /* obs agrege esta tabla para poner los datos dummie*/
  /*
  tabla=[
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  {"fecha":"20/06/1996","nombre":"arturo","nss":"213456"},
  ];
*/
  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecFecha';
  datosBusqueda: Array<CertificadoDefuncion> = [];
  public alert!: AlertInfo;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private certificadoService: CertificadoDefuncionService,
    private fb: FormBuilder
  ) {
    this.formAdd = fb.group({
      consultaDefuncionIni: new FormControl('', Validators.required),
      consultaDefuncionFin: new FormControl('', Validators.required),
      count: new FormControl(15, Validators.required),
      pagina: new FormControl(1, Validators.required),
    });
  }

  ngOnInit(): void {
    this.datesForm = this.fb.group({
      fechaInicial: [moment().format('YYYY-MM-DD'), Validators.required],
      fechaFinal: [moment().format('YYYY-MM-DD'), Validators.required],
    });
  }

  async irDetalle(extras: CertificadoDefuncion) {
    await sessionStorage.removeItem('certificadoDefuncion');
    sessionStorage.setItem(
      'certificadoDefuncion',
      await JSON.stringify(extras)
    );
    this.router.navigate(['detalle-certificado-defuncion']);
  }

  irNuevoRegistro() {
    sessionStorage.removeItem('certificadoDefuncion');
    this.router.navigate(['nuevo-certificado-defuncion']);
  }
  buscar() {
    const datos = this.formAdd.value;
    this.certificadoService
      .list(
        datos.consultaDefuncionIni,
        datos.consultaDefuncionFin,
        datos.pagina,
        datos.count
      )
      .subscribe((response) => {
        this.datosBusqueda = response;
        if (this.datosBusqueda.length == 0) {
          this.muestraAlerta(
            'Valide los filtros',
            'alert-warning',
            'Sin resultados'
          );
        }
      });

   
  }

  limpiar() {
    this.formAdd.controls['consultaDefuncionIni'].setValue('');
    this.formAdd.controls['consultaDefuncionFin'].setValue('');
    this.datosBusqueda = [];
  }
  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId;
    this.order = order;
    this.datosBusqueda.sort((a: any, b: any) => {
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
        data = moment(val, 'YYYY/MM/DD');
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
  ngAfterViewInit(): void {
    $('#consultaDefuncionIni').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('consultaDefuncionIni')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('consultaDefuncionIni')?.patchValue(null);
        }
      },
    });
    $('#consultaDefuncionFin').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('consultaDefuncionFin')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('consultaDefuncionFin')?.patchValue(null);
        }
      },
    });
  }

  onFormChanges() {
    this.formAdd.valueChanges.subscribe((change) => {
      if (this.formAdd.valid) {
        this.validarCampos = false;
      } else {
        console.log('el fomulario sigue siendo invalido', this.formAdd.value);
      }
    });
  }

  muestraAlerta(
    mensaje: string,
    estilo: string,
    tipoMsj?: string,
    funxion?: any
  ) {
    this.alert = new AlertInfo();
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj,
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
