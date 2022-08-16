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
import { pacienteSeleccionado } from '../../busqueda-nss/paciente.interface';
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service';


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
  paginacion: any;
  public page: number = 1;
  public pageSize: number = 15;
  public resultadoTotal: number = 0;
  public dtOptions: DataTables.Settings = {};
  public numitems: number = 15;
  public order: string = 'desc';
  public tabla: [] = [];
  public extras: any;
  public datesForm!: FormGroup;
  public columnaId: string = 'fecFecha';
  datosBusqueda: Array<CertificadoDefuncion> = [];
  public alert!: AlertInfo;
  //se utiliza para el Sort desde el back end
  criteriosDeOrden: Array<any> = [];
  public nss: string;
  paciente!: pacienteSeleccionado;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private certificadoService: CertificadoDefuncionService,
    private fb: FormBuilder,
    private tarjetaService: AppTarjetaPresentacionService,
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
    this.paciente = this.tarjetaService.get();
    if (!this.paciente) {
      this.paciente = JSON.parse(localStorage.getItem('paciente')!);
      this.nss = this.paciente.nss.toString();
    }
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
  onSelectChange() {
    const datos = this.formAdd.value;
    const fechaIni = moment(datos.consultaDefuncionIni, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fechaFin = moment(datos.consultaDefuncionFin, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    this.page = 1;
    this.certificadoService

      .list(
        fechaIni,
        fechaFin,
        0,
        datos.count,
        JSON.stringify(this.criteriosDeOrden)
      )
      .subscribe((response) => {
        this.datosBusqueda = response;
      });
  }
  onPagechange(event: any) {
    this.page = event;
    const datos = this.formAdd.value;
    const fechaIni = moment(datos.consultaDefuncionIni, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fechaFin = moment(datos.consultaDefuncionFin, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );

    this.certificadoService
      .list(
        fechaIni,
        fechaFin,

        this.page - 1,
        datos.count,
        JSON.stringify(this.criteriosDeOrden)
      )
      .subscribe((response) => {
        console.log(response);
        this.datosBusqueda = response;
      });
  }
  async buscar() {
    const datos = this.formAdd.value;
    const fechaIni = moment(datos.consultaDefuncionIni, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fechaFin = moment(datos.consultaDefuncionFin, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );



    if (fechaFin >= fechaIni) {

      let busqueda = {
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        nssPaciente: this.paciente.nss,
        agregadoMedico: this.paciente.agregadoMedico

      }
      this.paginacion = await this.certificadoService
        .getPagination(fechaIni, fechaFin)
        .toPromise();

      console.log(this.paginacion);
      this.certificadoService
        .obtenerListaCertificados(busqueda)
        // .list(fechaIni, fechaFin, datos.pagina - 1, datos.count)
        .subscribe((response) => {this.datosBusqueda = response;
          console.log(response);
          if (this.datosBusqueda.length == 0) {
            this.muestraAlerta(
              'Valide los filtros',
              'alert-warning',
              'Sin resultados'
            );
          }
        });
    }else{
      this.muestraAlerta(
        'Valide los filtros',
        'alert-warning',
        'Sin resultados'
      );
         this.datosBusqueda = [];
    }
  }

  limpiar() {
    this.formAdd.controls['consultaDefuncionIni'].setValue('');
    this.formAdd.controls['consultaDefuncionFin'].setValue('');
    this.datosBusqueda = [];
  }

  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId;
    this.order = order;
    const criterio = {
      propiedad: columnaId,
      ordenar: true,
      orden: order,
    };
    this.addCriterio(criterio);
    console.log('ordenando propiedad', criterio);
    const datos = this.formAdd.value;
    const fechaIni = moment(datos.consultaDefuncionIni, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fechaFin = moment(datos.consultaDefuncionFin, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    this.certificadoService.list(fechaIni,fechaFin,this.page - 1,datos.count,JSON.stringify(this.criteriosDeOrden))
    .subscribe((response) => {console.log(response);this.datosBusqueda = response;});
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
          date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
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
          date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
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
  addCriterio(criterio: any) {
    const index = this.criteriosDeOrden.findIndex(item =>
      item.propiedad === criterio.propiedad
    );
    console.log(index)
    if (index > -1) {
      this.criteriosDeOrden.splice(index);
      this.criteriosDeOrden.push(criterio);
    } else {
      this.criteriosDeOrden.push(criterio);
    }
    console.log(this.criteriosDeOrden);
  }
}
