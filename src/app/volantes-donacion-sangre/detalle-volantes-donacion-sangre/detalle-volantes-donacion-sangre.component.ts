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
    let nss = "";
    let desNssAgregado = "";
    let timHoraFinalAtencion = "";
    let timHoraInicialAtencion = "";
    this.volantesDonacion.nssCompleto=this.volantesDonacion?.desNssAgregado;
    try {
      let datosnss = this.volantesDonacion?.desNssAgregado.split(" ");
      nss = datosnss[0];
      desNssAgregado = datosnss[1];
      let hora1 = this.volantesDonacion?.timHoraInicialAtencion.split(":");
      timHoraInicialAtencion = hora1[0] + ":" + hora1[1];
      let hora2 = this.volantesDonacion?.timHoraFinalAtencion.split(":");
      timHoraFinalAtencion = hora2[0] + ":" + hora2[1];
      
    } catch (error) {
      console.log(error)
    }


    this.volantesDonacion.desNssAgregado = desNssAgregado;
    this.volantesDonacion.nss = nss;
    this.volantesDonacion.timHoraFinalAtencion = timHoraFinalAtencion;
    this.volantesDonacion.timHoraInicialAtencion = timHoraInicialAtencion;


    console.log('DATA REPORT: ', this.volantesDonacion);
    this.volantesService.downloadPdf(this.volantesDonacion).subscribe(
      (response: any) => {
        // console.log(response);
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);

        this.volantesDonacion.desNssAgregado=this.volantesDonacion?.nssCompleto ;
      },
      (error: HttpErrorResponse) => {
        this.volantesDonacion.desNssAgregado=this.volantesDonacion?.nssCompleto ;
        console.error(error);
        console.error('Error al descargar reporte: ', error.message);
      }
    );
  }


}
