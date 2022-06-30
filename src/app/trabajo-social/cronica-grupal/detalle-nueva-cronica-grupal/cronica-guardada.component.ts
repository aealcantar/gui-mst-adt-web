import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CronicaGrupalService } from "../../services/cronica-grupal.service";
// import { objAlert } from 'src/app/shared-modules/models/alerta.interface';
import { AlertInfo } from 'src/app/shared-modules/models/app-alert.interface';

@Component({
  selector: 'app-cronica-guardada',
  templateUrl: './cronica-guardada.component.html',
  styleUrls: ['./cronica-guardada.component.css']
})

export class CronicaGuardadaComponent implements OnInit, OnDestroy {

  alert!: AlertInfo;

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: Subscription | undefined;
  months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  today:any;
  day:any;
  month:any;
  year:any;

  cronica: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService
  ) { }

  ngOnInit(): void {
    this.muestraAlerta(
      '¡La información se guardó con éxito!',
      'alert-success',
      '',
    );

    // this.showSucces("¡La información se guardó con éxito!");
    this.route.queryParamMap.subscribe((params: any) => {
      this.cronica = JSON.parse(params.getAll('cronica'));
      console.log("OBJETO ENVIADO: ", this.cronica);
    });

    const currentDate = new Date();
    this.day = currentDate.getDate();
    this.month = currentDate.getMonth();
    this.year = currentDate.getFullYear();
    this.today = currentDate;

    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?:any) {
    // this.alert = new AlertInfo;
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
    }, 99999992000);
  }

  regresar() {
    this.router.navigateByUrl("/consulta-cronica-grupal", { skipLocationChange: true });
  }

  imprimir() {
    let data: any = {
        ooad: "CDMX NORTE",
        unidad: "HGZ 48 SAN PEDRO XALAPA",
        clavePtal: "35E1011D2153",
        turno: "MATUTINO",
        servicio: "GRUPO",
        grupo: "TOUR QUIRURJICO",
        // grupo : this.cronica.desGrupo !== null ? this.cronica.desGrupo : "",
        fecha: this.cronica.fecFechaCorta !== null ? this.cronica.fecFechaCorta : "",
        hora: this.cronica.timHora !== null ? this.cronica.timHora : "",
        ponentes: this.cronica.descPonentes !== null ? this.cronica.descPonentes : "",
        numAsistentes: this.cronica.numTotalParticipantes !== null ? this.cronica.numTotalParticipantes : "",
        tecnicaDidactica: this.cronica.desTecnicaDidactica !== null ? this.cronica.desTecnicaDidactica : "",
        materialApoyo: this.cronica.desMaterialApoyo !== null ? this.cronica.desMaterialApoyo : "",
        objetivoSesion: this.cronica.desObjetivosSesion !== null ? this.cronica.desObjetivosSesion : "",
        contenido: this.cronica.desDesarrolloSesion !== null ? this.cronica.desDesarrolloSesion : "",
        perfilGrupo: this.cronica.desPerfilGrupo !== null ? this.cronica.desPerfilGrupo : "",
        observaciones: this.cronica.desObservaciones !== null ? this.cronica.desObservaciones : "",
        trabajadorSocial: "Antonio Esteban Alcántar",
        participantes: this.cronica.participanteList
    };
    console.log("DATA REPORT: ", data);
    this.cronicaGrupalService.downloadPdf(data).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      }, (error: HttpErrorResponse) => {
        console.error("Error al descargar reporte: ", error.message);
      }
    )
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
