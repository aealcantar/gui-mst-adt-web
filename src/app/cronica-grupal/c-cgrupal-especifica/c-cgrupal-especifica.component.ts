import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CronicaGrupalService } from "src/app/service/cronica-grupal.service";
import { formatDate } from '@angular/common';
import { Usuario } from "src/app/models/usuario.model";

@Component({
  selector: 'app-c-cgrupal-especifica',
  templateUrl: './c-cgrupal-especifica.component.html',
  styleUrls: ['./c-cgrupal-especifica.component.css']
})
export class CCGrupalEspecificaComponent implements OnInit {

  public months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  public today: any;
  public day: any;
  public month: any;
  public year: any;
  public cronica: any;
  public catalogoEstatus: any[] = ['No impartida','Por impartir','Impartida'];
  public datetimeFormat = '';
  public dateToday= new Date();
  public usuario!: Usuario;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService
  ) { 
    this.datetimeFormat = formatDate(this.dateToday, 'yyyy/MM/dd hh:mm:ss', 'en-ES');
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('cronica').length > 0) {
        this.cronica = JSON.parse(params.getAll('cronica'))
      }
      console.log("OBJETO ENVIADO PARA DETALLE: ", this.cronica);
    });
    let userTmp = sessionStorage.getItem('usuario') || '';
    if (userTmp !== '') {
      this.usuario = JSON.parse(userTmp);
      console.log("USER DATA: ", this.usuario);
    }
    console.log("FECHA: ", this.cronica?.fecFechaCorta);
    this.day = this.cronica?.fecFechaCorta.substring('0','2');
    console.log("DAY: ", this.day);
    const month = this.cronica?.fecFechaCorta.substring('3','5');
    switch(month) {
      case '01':
          this.month = 'enero';
          break;
      case '02':
          this.month = 'febrero';
          break;
      case '03':
          this.month = 'marzo';
          break;
      case '04':
          this.month = 'abril';
          break;
      case '05':
          this.month = 'mayo';
          break;
      case '06':
          this.month = 'junio';
          break;
      case '07':
          this.month = 'julio';
          break;
      case '08':
          this.month = 'agosto';
          break;
      case '09':
          this.month = 'septiembre';
          break;
      case '10':
          this.month = 'octubre';
          break;
      case '11':
          this.month = 'noviembre';
          break;
      case '12':
          this.month = 'diciembre';
          break;
  }
    console.log("MONTH: ", this.month);
    this.year = this.cronica?.fecFechaCorta.substring('6','10');
    console.log("YEAR: ", this.year);
    const currentDate = new Date(this.year+"-"+this.month+"-"+this.day);
    this.today = currentDate;
    console.log("DATE: ", this.today);
  }

  cancelar() {
    this.router.navigateByUrl("/consulta-cronica-grupal", { skipLocationChange: true });
  }

  imprimir() {
    let fechaTransformada = this.datetimeFormat;
    let data: any = {
      ooad: "CDMX NORTE",
        unidad: "HGZ 48 SAN PEDRO XALAPA",
        clavePtal: "35E1011D2153",
        turno: "MATUTINO",
        servicio: "GRUPO",
        grupo : this.cronica?.desGrupo !== null ? this.cronica?.desGrupo : "",
        fecha: this.cronica?.fecFechaCorta !== null ? this.cronica?.fecFechaCorta : "",
        hora: this.cronica?.timHora !== null ? this.cronica?.timHora : "",
        ponentes: this.cronica?.descPonentes !== null ? this.cronica?.descPonentes : "",
        numAsistentes: this.cronica?.numTotalParticipantes !== null ? this.cronica?.numTotalParticipantes : "",
        tecnicaDidactica: this.cronica?.desTecnicaDidactica !== null ? this.cronica?.desTecnicaDidactica : "",
        materialApoyo: this.cronica?.desMaterialApoyo !== null ? this.cronica?.desMaterialApoyo : "",
        objetivoSesion: this.cronica?.desObjetivosSesion !== null ? this.cronica?.desObjetivosSesion : "",
        contenido: this.cronica?.desDesarrolloSesion !== null ? this.cronica?.desDesarrolloSesion : "",
        perfilGrupo: this.cronica?.desPerfilGrupo !== null ? this.cronica?.desPerfilGrupo : "",
        observaciones: this.cronica?.desObservaciones !== null ? this.cronica?.desObservaciones : "",
        fecImpresion: fechaTransformada,
        trabajadorSocial: this.usuario?.strNombres + " " + this.usuario?.strApellidoP + " " + this.usuario?.strApellidoM
    };
    console.log("DATA REPORT: ", data);
    this.cronicaGrupalService.downloadPdf(data).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' });
        // const filename = "Reporte.pdf";
        const url = window.URL.createObjectURL(file);
        window.open(url);
      }, (error: HttpErrorResponse) => {
        console.error("Error al descargar reporte: ", error.message);
      }
    )
  }

}
