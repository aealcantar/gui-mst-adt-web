import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertInfo } from 'src/app/shared-modules/models/alerta.interface';
import { VolantesDonacionService } from '../../services/volantes-donacion.service';

@Component({
  selector: 'app-detalle-volantes-donacion-sangre',
  templateUrl: './detalle-volantes-donacion-sangre.component.html',
  styleUrls: ['./detalle-volantes-donacion-sangre.component.css']
})
export class DetalleVolantesDonacionSangreComponent implements OnInit {
  detalle: any = {};
  alert!: AlertInfo;
  constructor(private volantesService: VolantesDonacionService, private rutaActiva: ActivatedRoute, private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((params: any) => {

      let valida = this.rutaActiva.snapshot.paramMap.get('proviene');
      console.log(valida)
      if (valida != null) {
        this.muestraAlerta(
          '¡La información se guardo con éxito!',
          'alert-success',
          ''
        );
      }


      if (params.getAll('datosVolante').length > 0) {
        this.detalle = JSON.parse(params.getAll('datosVolante'))

      }
      console.log('OBJETO ENVIADO PARA DETALLE: ', this.detalle)
    })
  }


  //muesta el mensaje de alerta
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


  impirmiVolante() {
    let data: any = { 
      uMedicaH: this.detalle.desUnidadMedicaHospitalaria,
      fechaSolc: this.detalle.fecEfec,
      nombreBancoS: this.detalle.idNombreBancoSangre,
      calleBanco: this.detalle.nomCalle,
      noBanco: this.detalle.numExterior,
      colBanco: this.detalle.nomColonia,
      cpBanco: this.detalle.desCodigoPostal,
      alcaldiaBanco: this.detalle.idDelegacionMunicipio,
      hrDesde: this.detalle.timInicialAtencion,
      hrHasta: this.detalle.timFinalAtencion,
      nss: this.detalle.noFolioControl,
      agregado: this.detalle.desNssAgregado,
      fechaInter: this.detalle.fecInternamiento,
      fechaCir: this.detalle.fecCirugia,
      servicio: this.detalle.idServicio,
      telPaciente: this.detalle.numTelefonoPaciente,
      nombreTS: this.detalle.nomTrabajadorSocial,
      matricula: this.detalle.desMatriculaTrabajadorSocial,
      telTS: this.detalle.numTelefonoTrabajadorSocial,
      observaciones: this.detalle.desObservaciones,
      nombrePac: this.detalle.nomPaciente,
    };
    console.log('DATA REPORT: ', this.detalle);
    console.log('DATA : ', data);
    this.volantesService.downloadPdf(data).subscribe(
      (response: any) => {
        // console.log(response);
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        console.error('Error al descargar reporte: ', error.message);
      }
    );
  }


}
