import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
import { objAlert } from '../common/alerta/alerta.interface';
import { EstadoCivil } from '../models/estado-civil.model';
import { EstudioMedico } from '../models/estudio-medico.model';
import { Ocupacion } from '../models/ocupacion.model';
import { EstudioSocialMedicoService } from '../service/estudio-social-medico.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-estudio-medico-guardado',
  templateUrl: './estudio-medico-guardado.component.html',
  styleUrls: ['./estudio-medico-guardado.component.css']
})
export class EstudioMedicoGuardadoComponent implements OnInit {

  alert!: objAlert;
  executed: boolean = false;

  datosGenerales = false;
  datosFamiliar = false;
  datosExploracionCaso = false;
  estudioMedico!: EstudioMedico;
  pacienteSeleccionado!: pacienteSeleccionado;
  ocupaciones: Ocupacion[] = [];
  catEstadosCiviles: EstadoCivil[] = [];
  datetimeFormat = '';
  dateToday= new Date();

  constructor(
    private route: ActivatedRoute,
    private estudioMedicoService: EstudioSocialMedicoService
  ) { 
    this.datetimeFormat = formatDate(this.dateToday, 'yyyy/MM/dd hh:mm:ss', 'en-ES');
  }

  ngOnInit(): void {
    this.datosGenerales = true;
    this.datosFamiliar = false;
    this.datosExploracionCaso = false;
    this.loadCatalogos();
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('estudioMedico').length > 0) {
        this.estudioMedico = JSON.parse(params.getAll('estudioMedico'));
        if (this.estudioMedico.esNuevo) {
          this.muestraAlerta(
            '¡La información se guardó con éxito!',
            'alert-success',
            '',
          );
        }
      }
      console.log("OBJETO ENVIADO PARA DETALLE: ", this.estudioMedico);
    });
    this.pacienteSeleccionado = JSON.parse(localStorage.getItem('paciente')!);
    console.log("PACIENTE: ", this.pacienteSeleccionado);
  }

  irDatosDeFamiliar() {
    this.datosGenerales = false;
    this.datosFamiliar = true;
    this.datosExploracionCaso = false;
  }

  irExploracionCaso() {
    this.datosGenerales = false;
    this.datosFamiliar = false;
    this.datosExploracionCaso = true;
  }

  irDatosGenerales() {
    this.datosGenerales = true;
    this.datosFamiliar = false;
    this.datosExploracionCaso = false;
  }

  async loadCatalogos() {
    await this.estudioMedicoService.getCatEstadosCiviles().toPromise().then(
      (estadosCiviles: any) => {
        this.catEstadosCiviles = estadosCiviles;
        console.log("ESTADO CIVILES: ", this.catEstadosCiviles);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.estudioMedicoService.getCatOcupaciones().toPromise().then(
      (ocupaciones: Ocupacion[]) => {
        this.ocupaciones = ocupaciones;
        console.log("OCUPACIONES: ", this.ocupaciones);
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  getNombreOcupacion(idOcupacion: number | string) {
    let idOcupacionConverted: number;
    if (typeof idOcupacion === 'string') {
      idOcupacionConverted = Number(idOcupacion);
    } else if (typeof idOcupacion === 'number') {
      idOcupacionConverted = idOcupacion;
    }
    return this.ocupaciones.find(e => e.id_OCUPACION === idOcupacionConverted)?.nom_OCUPACION;
  }

  getNombreEstadoCivil(idEstadoCivil: number | string) {
    let idEstadoCivilConverted: number;
    if (typeof idEstadoCivil === 'string') {
      idEstadoCivilConverted = Number(idEstadoCivil);
    } else if (typeof idEstadoCivil === 'number') {
      idEstadoCivilConverted = idEstadoCivil;
    }
    return this.catEstadosCiviles.find(e => e.id === idEstadoCivilConverted)?.descripcion;
  }

  convertDate(fechaNacimiento: String): string  {
    let months;
    if (!this.executed) {
      this.executed = true;
      let stringDate = fechaNacimiento.substring(3, 5) + "-" + fechaNacimiento.substring(0, 2) + "-" + fechaNacimiento.substring(6, 10);
      let birthDate = new Date(stringDate);
      console.log("FECHA: ", birthDate);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      months = today.getMonth() - birthDate.getMonth();
      if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      console.log("EDAD: ", age);
      if (months > 0) {
        console.log("MESES: ", months);
        months = months;
      } else {
        months = months + 12;
        console.log("MESES: ", months);
      }
    }
    return months + " meses";
  }

  imprimir() {
    let fechaTransformada = this.datetimeFormat;
    let reporteEstudioMedicoSocial: any = {
      ooad: "CDMX NORTE",
      unidad: "UMF " + this.pacienteSeleccionado.unidadMedica,
      turno: this.pacienteSeleccionado.turno === "M" ? "MATUTINO" : "VESPERTINO",
      servicio: "GRUPO",
      cvePtal: "35E1011D2153",
      fecImpresion: fechaTransformada,
      nss: this.pacienteSeleccionado.nss,
      aMedico: this.pacienteSeleccionado.agregadoMedico,
      nombrePaciente: this.pacienteSeleccionado.paciente.toUpperCase(),
      curp: this.pacienteSeleccionado.curp,
      unidad2: "UMF " + this.pacienteSeleccionado.unidadMedica,
      consultorio: this.pacienteSeleccionado.consultorio,
      edad: this.pacienteSeleccionado.edad + " años " + this.convertDate(this.pacienteSeleccionado.fechaNacimiento),
      sexo: this.pacienteSeleccionado.sexo === "M" ? "Masculino" : "Femenino",
      calle: this.estudioMedico.nomVialidad,
      numeroInt: this.estudioMedico.numInterior,
      colonia: this.estudioMedico.nomColonia,
      cp: this.estudioMedico.codigoPostal,
      estado: this.estudioMedico.nombreEstado,
      tcasa: this.estudioMedico.numTelefonoFijo,
      tcelular: this.estudioMedico.numTelefonoCelular,
      correo: this.estudioMedico.correoElectronico,
      objetivoEstudio: this.estudioMedico.objetivoEstudio,
      datosPaciente: this.estudioMedico.datoPaciente,
      datosFamiliares: this.estudioMedico.datoFamiliar,
      datosEconomicos: this.estudioMedico.datoEconomico,
      municipio: this.estudioMedico.nombreDelegacionMunicipio,
      estudioSolicitado: this.estudioMedico.nombreSolicitante?.toUpperCase(),
      fechaEstudio: this.estudioMedico.fecFecha,
    };

    console.log("DATA REPORT: ", reporteEstudioMedicoSocial);
    this.estudioMedicoService.downloadPdf(reporteEstudioMedicoSocial).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      }, (error: HttpErrorResponse) => {
        console.error("Error al descargar reporte: ", error.message);
      }
    )
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?:any) {
    this.alert = new objAlert;
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
      if(funxion != null){
        funxion();
      }
    }, 2000);
  }

}
