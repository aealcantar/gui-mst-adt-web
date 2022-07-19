import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
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
  validarCampos: boolean = false;
  @ViewChild('btnGuardar') btnGuardar: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService,
    private certificadoService: CertificadoDefuncionService
  ) {
    this.formAdd = formBuilder.group({
      fechaDefuncion: new FormControl('', Validators.required),
      nombreServicio: new FormControl(''),
      horaDefuncion: new FormControl('', Validators.required),
      folioCertificacion: new FormControl('', Validators.required),
      nssPaciente: new FormControl(''),
      cveServicio: new FormControl('', Validators.required),
      nombreAsegurado: new FormControl('', Validators.required),
      fechaDeEntregaDeCertificado: new FormControl('', Validators.required),
      horaDeEntregaDeCertificado: new FormControl('', Validators.required),
      nombreFuneraria: new FormControl('', Validators.required),
      nombreFamiliar: new FormControl('', Validators.required),
      parentescoFamiliar: new FormControl('', Validators.required),
      observaciones: new FormControl('', Validators.required),
      nombrePersonalElaboro: new FormControl('', Validators.required),
      matriculaPersonalElaboro: new FormControl('', Validators.required),
      cvePersonalQueElaboro: new FormControl('', Validators.required),
      fechaDeAlta: new FormControl('', Validators.required),
      fechaDeActualizacion: new FormControl('', Validators.required),
      indActivo: new FormControl(0),
    });
  }
  ngAfterViewInit(): void {
    $('#fhDefuncion').datepicker({
      dateFormat: 'dd/mm/yyyy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
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
      dateFormat: 'dd/mm/yyyy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
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

  onServicioSelect(select: MatSelectChange) {
    const nombreDeServicio = select.source.triggerValue;
    this.formAdd.controls['nombreServicio'].setValue(nombreDeServicio);
  }

  listaServicios: Array<any> = [];
  ngOnInit(): void {
    this.cargarServicios();
    const userTemp = sessionStorage.getItem('usuario') || '';
    this.paciente = JSON.parse(localStorage.getItem('paciente'));
    if (userTemp !== '') {
      this.usuario = JSON.parse(userTemp);
    }

    this.formAdd
      .get('nombrePersonalElaboro')
      .setValue(
        `${this.usuario.strNombres} ${this.usuario.strApellidoP} ${this.usuario.strApellidoM}`
      );
    this.formAdd
      .get('matriculaPersonalElaboro')
      .setValue(this.usuario.matricula);
    this.formAdd.get('nssPaciente').setValue(this.paciente.nss);
    this.formAdd.get('cvePersonalQueElaboro').setValue(this.usuario.cveUsuario);
    this.formAdd.controls['nombrePersonalElaboro'].disable();
    this.formAdd.controls['nssPaciente'].disable();
    this.formAdd.controls['matriculaPersonalElaboro'].disable();
    //cvePersonalQueElaboro
  }
  async cargarServicios() {
    this.cronicaGrupalService.getCatServicios().subscribe((servicios) => {
      this.listaServicios = servicios;
    });
  }

  async guardar() {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    this.formAdd.controls['fechaDeAlta'].setValue(date);
    this.formAdd.controls['fechaDeActualizacion'].setValue(date);
    if (this.formAdd.valid) {
      this.validarCampos = false;
      const certificadoDefuncion =
        this.formAdd.getRawValue() as CertificadoDefuncion;
      // cambiar formato de fechas en para su guardado en la base de datos
      const horaDefuncnion = moment(
        this.formAdd.controls['horaDefuncion'].value,
        'hh:mm A'
      ).format('hh:mm:ss');
      const horaEntrega = moment(
        this.formAdd.controls['horaDeEntregaDeCertificado'].value,
        'hh:mm A'
      ).format('hh:mm:ss');
      const fechaDefuncion = moment(
        certificadoDefuncion.fechaDefuncion,
        'DD/MM/YYYY'
      ).format('YYYY-MM-DD');
      const fechaEntrega = moment(
        certificadoDefuncion.fechaDefuncion,
        'DD/MM/YYYY'
      ).format('YYYY-MM-DD');
      certificadoDefuncion.horaDefuncion = horaDefuncnion;
      certificadoDefuncion.horaDeEntregaDeCertificado = horaEntrega;
      certificadoDefuncion.fechaDefuncion = fechaDefuncion;
      certificadoDefuncion.fechaDeEntregaDeCertificado = fechaEntrega;

      this.certificadoService.insert(certificadoDefuncion).subscribe(
        async (response) => {
          this.certificado = response;
          await sessionStorage.removeItem('certificadoDefuncion');
          sessionStorage.setItem(
            'certificadoDefuncion',
            await JSON.stringify(this.certificado)
          );
          this.router.navigate(['detalle-certificado-defuncion']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log(this.formAdd.getRawValue());
      this.validarCampos = true;
      this.onFormChanges();
    }
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
  cancelar(modal: any) {
    this.dialog.open(modal, {
      width: '450px',
      maxHeight: '350px',
    });
  }

  cancelarSinGuardar() {
    this.router.navigate(['consulta-certificado-defuncion']);
  }
}
