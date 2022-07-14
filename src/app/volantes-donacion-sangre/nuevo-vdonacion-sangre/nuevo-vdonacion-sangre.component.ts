import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, } from '@angular/forms' 
import { Validators } from '@angular/forms';
import { Municipio } from '../../models/municipio.model';
import { EstudioSocialMedicoService } from 'src/app/service/estudio-social-medico.service';  
import { HttpErrorResponse } from '@angular/common/http';
import { Ciudad } from '../../models/ciudad.model';
import { Estado } from '../../models/estado.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';  
import { VolantesDonacionService } from 'src/app/service/volantes-donacion.service';  
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service' 
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-nuevo-vdonacion-sangre',
  templateUrl: './nuevo-vdonacion-sangre.component.html',
  styleUrls: ['./nuevo-vdonacion-sangre.component.css']
})
export class NuevoVdonacionSangreComponent implements OnInit {
  submitted: boolean = false;
  formNuevaDonacion: any = this.formBuilder.group({
    umh: new FormControl('', Validators.required),
    fecha: new FormControl(''),
    idBancoSangre: new FormControl('', Validators.required),
    horaInicialAtencion1: new FormControl('', [Validators.required,
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
    horaInicialAtencion: new FormControl(''),
    horaFinalAtencion1: new FormControl('', [Validators.required,
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
    horaFinalAtencion: new FormControl(''),
    codigoPostal: new FormControl('', Validators.required),
    idEstado: new FormControl('', Validators.required),
    idDelegacion: new FormControl('', Validators.required),
    idCiudad: new FormControl('', Validators.required),
    colonia: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    numExterior: new FormControl('', Validators.required),
    numInterior: new FormControl('', Validators.required),
    nombrePaciente: new FormControl(''),
    desNSS: new FormControl(''),
    idServicio: new FormControl('', Validators.required),
    fechaInternamiento: new FormControl(''),
    fechaCirugia: new FormControl(''),
    numTelefonoPaciente: new FormControl('', Validators.required),
    nombreTrabajadorSocial: new FormControl('', Validators.required),
    matriculaTrabajadorSocial: new FormControl('', Validators.required),
    numTelefonoTrabajadorSocial: new FormControl('', Validators.required),
    observaciones: new FormControl('', Validators.required),
    fecha1: new FormControl('', [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/)]),
    fecha2: new FormControl('', [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/)]),
    fecha3: new FormControl('', [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/)]),


  });
  estadosFamiliar: Estado[] = [];
  ciudadesFamiliar: Ciudad[] = [];
  delegaciones: Municipio[] = [];
  listaServicios: Array<any> = [];
  alert!: AlertInfo;
  bancosSangre: Array<any> = [];
  fecha = moment(Date.now()).format('DD/MM/YYYY');
  paciente!: pacienteSeleccionado;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private estudioSocialService: EstudioSocialMedicoService,
    private cronicaGrupalService: CronicaGrupalService,
    private volantesDonacionService: VolantesDonacionService,
    private tarjetaService: AppTarjetaPresentacionService,
  ) { }

  ngOnInit(): void {
    this.estados();
    this.servicios();

    this.paciente = this.tarjetaService.get();

    if (this.paciente !== null && this.paciente !== undefined) {
      let nss = this.paciente.nss;
      let nssAgregado = this.paciente.agregadoMedico;
      let nombrePaciente = this.paciente.paciente;
      this.formNuevaDonacion.controls['nombrePaciente'].setValue(nombrePaciente);
      this.formNuevaDonacion.controls['desNSS'].setValue(nss + " " + nssAgregado);
    }
    this.formNuevaDonacion.controls['fecha1'].setValue(this.fecha);

    let userTmp = sessionStorage.getItem('usuario') || '';
    if (userTmp !== '') {
      let usuario = JSON.parse(userTmp);
      let nombre = usuario?.strNombres + " " + usuario?.strApellidoP + " " + usuario?.strApellidoM;
      let matricula= usuario?.matricula;
      this.formNuevaDonacion.controls['nombreTrabajadorSocial'].setValue(nombre);
      this.formNuevaDonacion.controls['matriculaTrabajadorSocial'].setValue(matricula);       
      }

    this.buscarBancosSangre();
  }

  buscarBancosSangre() {
    this.volantesDonacionService.getBancosSangre().subscribe(
      (res: any) => {

        try {
          let estatus = res.status;
          if (estatus == 'OK') {
            try {
              this.bancosSangre = res.datosBancosSangre;
            } catch (error) {
              console.error(error);
            }

          }
        } catch (error) {
          console.error(error);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  ngAfterViewInit(): void {
    $('#fecha1').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevaDonacion.controls['fecha1'].setValue(date);
        }
      },

    });
    $('#fecha2').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevaDonacion.controls['fecha2'].setValue(date);
        }
      },

    });
    $('#fecha3').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevaDonacion.controls['fecha3'].setValue(date);
        }
      },

    });

  }


  servicios() {
    this.cronicaGrupalService
      .getCatServicios()
      .toPromise()
      .then(
        (res) => {
          this.listaServicios = res;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }

  registarDonacion(formNuevaDonacion: FormGroup) {
    this.submitted = true;

    if (formNuevaDonacion.status != "INVALID") {

      //validando que los campos no vayan vacios
      if (this.formNuevaDonacion.value.umh.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['umh'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.fecha1.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['fecha1'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.horaInicialAtencion1.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['horaInicialAtencion1'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.horaFinalAtencion1.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['horaFinalAtencion1'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }


      if (this.formNuevaDonacion.value.codigoPostal.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['codigoPostal'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }



      if (this.formNuevaDonacion.value.codigoPostal.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['codigoPostal'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.colonia.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['colonia'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }


      if (this.formNuevaDonacion.value.calle.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['calle'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.numExterior.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['numExterior'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.fecha2.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['fecha2'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.fecha3.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['fecha3'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }




      if (this.formNuevaDonacion.value.nombreTrabajadorSocial.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['nombreTrabajadorSocial'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.matriculaTrabajadorSocial.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['matriculaTrabajadorSocial'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.numTelefonoTrabajadorSocial.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['numTelefonoTrabajadorSocial'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }

      if (this.formNuevaDonacion.value.observaciones.trim().length == 0 ? true : false) {
        this.formNuevaDonacion.controls['observaciones'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }


      this.formNuevaDonacion.controls['horaFinalAtencion'].setValue(formNuevaDonacion.value.horaFinalAtencion1 + ":00");
      this.formNuevaDonacion.controls['horaInicialAtencion'].setValue(formNuevaDonacion.value.horaInicialAtencion1 + ":00");
      let fechaa = formNuevaDonacion.value.fecha1.split("/");
      let fechaNew = fechaa[2] + "/" + fechaa[1] + "/" + fechaa[0];
      let fechaI = formNuevaDonacion.value.fecha2.split("/");
      let fechaInternamiento = fechaI[2] + "/" + fechaI[1] + "/" + fechaI[0];
      let fechaC = formNuevaDonacion.value.fecha3.split("/");
      let fechaCirugia = fechaC[2] + "/" + fechaC[1] + "/" + fechaC[0];
      this.formNuevaDonacion.controls['fecha'].setValue(fechaNew);
      this.formNuevaDonacion.controls['fechaInternamiento'].setValue(fechaInternamiento);
      this.formNuevaDonacion.controls['fechaCirugia'].setValue(fechaCirugia);

      let datos = JSON.stringify(this.formNuevaDonacion.value);
      this.volantesDonacionService.addVolante(datos).subscribe(async (res: any) => {


        let estatus = res.status;
        if (estatus == "OK") {
          let id = res.idVolanteDonacionSangre + "nuevo";
          await this.router.navigateByUrl("/detalle-volante-donacion-sangre/" + id);
        } else {
          this.muestraAlerta(
            '¡La información no se pudo guardar, intente más tarde!',
            'alert-danger',
            'Error'
          );
        }




      }, (error: any) => {
        this.muestraAlerta(
          '¡La información no se pudo guardar, intente más tarde!',
          'alert-danger',
          'Error'
        );
        console.error(error);
      });

    } else {
      this.muestraAlerta(
        'Verificar datos capturados',
        'alert-danger',
        'Error'
      );
      return;
    }

  }

  estados() {
    this.estudioSocialService.getCatEstados().toPromise().then(
      (estadosFamiliar: Estado[]) => {
        this.estadosFamiliar = estadosFamiliar;

      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }


  onChangeEstado(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.formNuevaDonacion.get('idEstado').value).toPromise().then(
      (delegaciones: Municipio[]) => {
        this.delegaciones = delegaciones;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }


  onChangeMunicipio(): void {
    this.estudioSocialService.getCiudadByEstadoMunicipio(this.formNuevaDonacion.get('idEstado').value,
      this.formNuevaDonacion.get('idDelegacion').value).toPromise().then(
        (ciudades: Ciudad[]) => {
          this.ciudadesFamiliar = ciudades;
          if (this.ciudadesFamiliar.length === 1) {
            this.formNuevaDonacion.controls['idCiudad'].setValue(this.ciudadesFamiliar[0].cve_ciudad);
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }


  modalcarga() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelarModal() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/consulta-volantes-donacion");
    $('#content').modal('hide');
  }


  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
    this.alert = new AlertInfo;
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
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
