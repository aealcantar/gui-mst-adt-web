import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { objAlert } from 'src/app/shared-modules/alerta/alerta.interface';
import { EstadoCivil } from '../shared-modules/models/estado-civil.model';
import { EstudioMedico } from '../shared-modules/models/estudio-medico.model';
import { Ocupacion } from '../shared-modules/models/ocupacion.model';
import { EstudioSocialMedicoService } from '../trabajo-social/services/estudio-social.service';

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
  ocupacion!: Ocupacion;
  catEstadosCiviles: EstadoCivil[] = [];

  constructor(
    private route: ActivatedRoute,
    private estudioMedicoService: EstudioSocialMedicoService
  ) { }

  ngOnInit(): void {
    this.datosGenerales = true;
    this.datosFamiliar = false;
    this.datosExploracionCaso = false;
    this.loadCatalogos();
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('estudioMedico').length > 0) {
        this.estudioMedico = JSON.parse(params.getAll('estudioMedico'));
        this.getOcupacionById(this.estudioMedico.idOcupacion!);
        if (this.estudioMedico.esNuevo) {
          this.showSucces("¡La información se guardó con éxito!");
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
        if (estadosCiviles && estadosCiviles.ArrayList.length > 0) {
          this.catEstadosCiviles = estadosCiviles.ArrayList;
          console.log("ESTADO CIVILES: ", this.catEstadosCiviles);
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
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

  async getOcupacionById(id: number) {
    try {
      this.ocupacion = await this.estudioMedicoService.getCatOcupacionById(id).toPromise();
    } catch (e) {
      console.error(e);
    }
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
    let reporteEstudioMedicoSocial: any = {
      ooad: "CDMX NORTE",
      unidad: "HGZ 48 SAN PEDRO XALAPA",
      turno: this.pacienteSeleccionado.turno === "M" ? "MATUTINO" : "VESPERTINO",
      servicio: "GRUPO",
      cvePtal: "35E1011D2153",
      nss: this.pacienteSeleccionado.nss,
      aMedico: this.pacienteSeleccionado.agregadoMedico,
      nombrePaciente: this.pacienteSeleccionado.paciente.toUpperCase(),
      curp: this.pacienteSeleccionado.curp,
      unidad2: this.pacienteSeleccionado.unidadMedica,
      consultorio: this.pacienteSeleccionado.consultorio,
      edad: this.pacienteSeleccionado.edad + "años " + this.convertDate(this.pacienteSeleccionado.fechaNacimiento),
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
      estudioSolicitado: this.estudioMedico.nombreSolicitante?.toUpperCase()
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

  //Success
  private showSucces(msg: string) {
    this.alert = {
      message: msg,
      type: 'success',
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false
      }
    }, 2000);
  }

}
