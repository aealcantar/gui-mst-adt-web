import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
import { Nota } from '../models/notas.model';
import { ReporteNota } from '../models/reporte-notas.model';
import { NotasService } from '../service/notas.service';

@Component({
  selector: 'app-consulta-nota-tsocial',
  templateUrl: './consulta-nota-tsocial.component.html',
  styleUrls: ['./consulta-nota-tsocial.component.css']
})
export class ConsultaNotaTSocialComponent implements OnInit {

  public nota!: Nota;
  public reporteNota!: ReporteNota;
  public months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  public today: any;
  public day: any;
  public month: any;
  public year: any;
  public pacienteSeleccionado!: pacienteSeleccionado;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notasService: NotasService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('nota').length > 0) {
        this.nota = JSON.parse(params.getAll('nota'))
      }
      console.log("OBJETO ENVIADO PARA DETALLE: ", this.nota);
    });
    this.pacienteSeleccionado = JSON.parse(localStorage.getItem('paciente')!);
    // this.notasService.getNotasById(1).subscribe(
    //   (res) => {
    //     this.nota = res;
    //   },
    //   (httpErrorResponse: HttpErrorResponse) => {
    //     console.error(httpErrorResponse);
    //   }
    // );
  }

  update() {
    let params = {
      'nota': JSON.stringify(this.nota),
    }
    this.router.navigate(["nueva-nota"], { queryParams: params, skipLocationChange: true });
  }

  imprimir() {
    this.reporteNota = {
      ooad: "CDMX NORTE",
      unidad: "HGZ 48 SAN PEDRO XALAPA",
      turno: "MATUTINO",
      servicio: "GRUPO",
      nss: String(this.pacienteSeleccionado.nss),
      aMedico: String(this.pacienteSeleccionado.agregadoMedico),
      nombrePaciente: this.pacienteSeleccionado.paciente.toUpperCase(),
      curp: String(this.pacienteSeleccionado.curp),
      unidad2: String(this.pacienteSeleccionado.unidadMedica),
      consultorio: String(this.pacienteSeleccionado.consultorio),
      fechaN: this.pacienteSeleccionado.fechaNacimiento.toString(),
      // edad: this.pacienteSeleccionado.edad,
      // sexo: this.pacienteSeleccionado.sexo,
	    nombreTS: '',
	    matriculaTS: '',
	    nombreTS2: '',
	    matriculaTS2: '',
	    tipoNota: this.nota.nombreTipoNota,
	    redApoyo: this.nota.nombreRedApoyo,
	    actividadTecnica: this.nota.nombreActividadTecnica,
	    diagnostico: this.nota.nombreDiagnostico,
	    redaccion: this.nota.redaccion,
	    tipoNota2: '',
	    redApoyo2: '',
	    actividadTecnica2: '',
	    diagnostico2: '',
	    redaccion2: '',
	    fecha1: this.nota.fecFecha,
	    fecha2: '',
	    diagnosticoSocial: this.nota.diagnostico,
	    diagnosticoSocial2: '',
    };
    this.notasService.downloadPdf(this.reporteNota).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      }, (error: HttpErrorResponse) => {
        console.error("Error al descargar reporte: ", error.message);
      }
    )
  }

}
