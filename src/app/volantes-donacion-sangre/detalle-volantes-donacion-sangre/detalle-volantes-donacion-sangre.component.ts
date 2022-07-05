import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service' 
import { VolantesDonacion } from 'src/app/models/volantes-donacion.model'; 
import { VolantesDonacionService } from 'src/app/service/volantes-donacion.service';  

@Component({
  selector: 'app-detalle-volantes-donacion-sangre',
  templateUrl: './detalle-volantes-donacion-sangre.component.html',
  styleUrls: ['./detalle-volantes-donacion-sangre.component.css']
})
export class DetalleVolantesDonacionSangreComponent implements OnInit {

  alert!: AlertInfo;
  idVolanteDonacion: string = "";
  paciente!: pacienteSeleccionado;
  volantesDonacion!: VolantesDonacion;


  constructor(private volantesService: VolantesDonacionService,
    private volantesDonacionService: VolantesDonacionService,
    private rutaActiva: ActivatedRoute,
    private tarjetaService: AppTarjetaPresentacionService,) { }

  ngOnInit(): void {

    this.idVolanteDonacion = this.rutaActiva.snapshot.paramMap.get('id');
    this.paciente = this.tarjetaService.get();
    if (Number(this.idVolanteDonacion) > 0) {
      this.buscarDetalleVolanteDonacion();
    } else {
      this.muestraAlerta(
        '¡La información se guardo con éxito!',
        'alert-success',
        ''
      );
      this.idVolanteDonacion = this.idVolanteDonacion.replace("nuevo", "");
      this.buscarDetalleVolanteDonacion();

    }

  }

  //buscar detalloe de volante de donacion

  buscarDetalleVolanteDonacion() {
    this.volantesDonacionService.getDetatelleVolanteDonacion(this.idVolanteDonacion).subscribe(
      (res: any) => {
console.log(res)
        try {
          let estatus = res.status;
          if (estatus == 'OK') {
            try {
              this.volantesDonacion = res.datosVolantesDonacion;
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
    let nss= "";
    let desNssAgregado="";
    let datosnss=  this.volantesDonacion?.desNssAgregado.split(" ");
    try {
        nss=  datosnss[0];
      desNssAgregado=datosnss[1];
    } catch (error) {
      
    }
 
    let data: any = {
      uMedicaH: this.volantesDonacion?.desUnidadMedicaHospitalaria,
      fechaSolc: this.volantesDonacion?.fecEfec,
      nombreBancoS: this.volantesDonacion?.idNombreBancoSangre,
      calleBanco: this.volantesDonacion?.nomCalle,
      noBanco: this.volantesDonacion?.numExterior,
      colBanco: this.volantesDonacion?.nomColonia,
      cpBanco: this.volantesDonacion?.desCodigoPostal,
      alcaldiaBanco: this.volantesDonacion?.idDelegacionMunicipio,
      hrDesde: this.volantesDonacion?.timHoraInicialAtencion,
      hrHasta: this.volantesDonacion?.timHoraFinalAtencion,
      nss: nss,
      agregado: desNssAgregado,
      fechaInter: this.volantesDonacion?.fecInternamiento,
      fechaCir: this.volantesDonacion?.fecCirugia,
      servicio: this.volantesDonacion?.idServicio,
      telPaciente: this.volantesDonacion?.numTelefonoPaciente,
      nombreTS: this.volantesDonacion?.nomTrabajadorSocial,
      matricula: this.volantesDonacion?.desMatriculaTrabajadorSocial,
      telTS: this.volantesDonacion?.numTelefonoTrabajadorSocial,
      observaciones: this.volantesDonacion?.desObservaciones,
      nombrePac: this.volantesDonacion?.nomPaciente,
    };
    console.log('DATA REPORT: ', this.volantesDonacion);
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
