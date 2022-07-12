import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

declare var $: any;
@Component({
  selector: 'app-nuevo-certificado',
  templateUrl: './nuevo-certificado.component.html',
  styleUrls: ['./nuevo-certificado.component.css'],
})
export class NuevoCertificadoComponent implements OnInit, AfterViewInit {
  formAdd;
  certificado: CertificadoDefuncion;
  usuario!: Usuario;
  paciente!: Paciente;
  hasCertificado: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService,
    private certificadoService: CertificadoDefuncionService
  ) {
    this.formAdd = formBuilder.group({
      fechaDefuncion: new FormControl('', Validators.required),
      horaDefuncion: new FormControl('', Validators.required),
      foliofuncion: new FormControl('', Validators.required),
      nssPaciente: new FormControl(''),
      cveServicio: new FormControl('', Validators.required),
      nombreAsegurado: new FormControl('', Validators.required),
      fechaDeEntregaDeCertificado: new FormControl('', Validators.required),
      horaDeEntregaDeCertificado: new FormControl('', Validators.required),
      nombreFuneraria: new FormControl('', Validators.required),
      nombreFamiliar: new FormControl('', Validators.required),
      parentescoFamiliar: new FormControl('', Validators.required),
      observaciones: new FormControl('', Validators.required),
      trabajadorSocial: new FormControl(''),
      matricula: new FormControl(''),
      cvePersonalQueElaboro: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {
    $('#fhDefuncion').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('fechaDefuncion')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('fechaDefuncion')?.patchValue(null);
        }
      },
    });
    $('#entregaCertificado').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('fechaDeEntregaDeCertificado')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('fechaDeEntregaDeCertificado')?.patchValue(null);
        }
      },
    });
  }

  listaServicios: Array<any> = [];
  ngOnInit(): void {
    const userTemp = sessionStorage.getItem('usuario') || '';
    this.paciente = JSON.parse(localStorage.getItem('paciente'));
    if (userTemp !== '') {
      this.usuario = JSON.parse(userTemp);
    } else {
      this.usuario = new Usuario();
      this.usuario.cveUsuario = 12;
      this.usuario.matricula = 'XXXX-XXXX-XX';
      this.usuario.strNombres = 'Alan Isaac Villafan';
    }
    this.cargarServicios();
    this.formAdd.get('trabajadorSocial').setValue(this.usuario.strNombres);
    this.formAdd.get('matricula').setValue(this.usuario.matricula);
    this.formAdd.get('nssPaciente').setValue(this.paciente.nss);
    this.formAdd.get('cvePersonalQueElaboro').setValue(this.usuario.cveUsuario);
    //cvePersonalQueElaboro
  }
  async cargarServicios() {
    this.cronicaGrupalService.getCatServicios().subscribe((servicios) => {
      this.listaServicios = servicios;
    });
  }
  imprimir() {
    if (this.certificado !== undefined) {
    }
  }
  guardar() {
    if (this.formAdd.valid) {
      const certificado = this.formAdd.value as CertificadoDefuncion;
      console.log(certificado);
      //  this.certificado = certificado;
      this.hasCertificado = true;
      this.certificadoService.insert(certificado).subscribe((response) => {
        console.log(response);
        this.certificado = response;

        this.hasCertificado = true;
      });
    } else {
      console.log(
        `'formulario no valido' ${JSON.stringify(this.formAdd.value)}`
      );
    }
  }
  cancelar() {
    console.log(this.formAdd.valid);
    console.log(this.formAdd.value);
  }
}
