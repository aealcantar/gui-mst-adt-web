import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { AvisoMP } from 'src/app/models/aviso-mp.model';
import { AvisoMinisterioPublicoService } from 'src/app/service/aviso-mp.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detalle-avisos-mp',
  templateUrl: './detalle-avisos-mp.component.html',
  styleUrls: ['./detalle-avisos-mp.component.css']
})
export class DetalleAvisoMpComponent implements OnInit {
  alert!: AlertInfo;
  avisoMp!: any;


  constructor(
    private avisoMinisterioPublicoService: AvisoMinisterioPublicoService,
    private route: ActivatedRoute,
    private tarjetaService: AppTarjetaPresentacionService,) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('idAvisoMp').length > 0) {
        const idAvisoMp = JSON.parse(params.getAll('idAvisoMp'));
        this.obtenerAvisoById(idAvisoMp);
      }
    })

  }

  obtenerAvisoById(idAvisoMp: number) {
    this.avisoMinisterioPublicoService.getAvisoById(idAvisoMp).subscribe(
      (res: any) => {
        try {
          let estatus = res.status;
          if (estatus == 'OK') {
            try {
              this.avisoMp = res.datosAvisoMp;
              this.avisoMp.fechaIngreso = moment(this.avisoMp.fechaIngreso, 'YYYY-MM-DD').format('DD/MM/YYYY');
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

  imprimirAvisoMp() {
    let imprimirAvisoObj = {
      estado: this.avisoMp?.estado,
      dia: moment(this.avisoMp?.fechaElaboracion, 'DD/MM/YYYY').format('DD'),
      mes: moment(this.avisoMp?.fechaElaboracion, 'DD/MM/YYYY').format('MM'),
      año: moment(this.avisoMp?.fechaElaboracion, 'DD/MM/YYYY').format('YYYY'),
      alcaldia: this.avisoMp?.delegacionMunicipio,
      nombrePac: this.avisoMp?.nombrePaciente,
      nombreHosp: this.avisoMp?.unidadMedica,
      ubicacionHosp: this.avisoMp?.ubicacionHospital,
      servicio: this.avisoMp?.especialidad,
      cama: this.avisoMp?.cama,
      fecIngreso: this.avisoMp?.fechaIngreso,
      hrIngreso: this.avisoMp?.horaIngreso,
      observaciones: this.avisoMp?.lesionesPaciente,
      nomMedico: this.avisoMp?.nombreMedico,
      matriculaMed: this.avisoMp?.matriculaMedico,
      nomTS: this.avisoMp?.nombreTrabajadorSocial,
      matTS: this.avisoMp?.matriculaTrabajadorSocial,
    }
    this.avisoMinisterioPublicoService.downloadPdf(imprimirAvisoObj).subscribe(
      (response: any) => {
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
