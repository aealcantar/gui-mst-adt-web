import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlArticulosService } from '../../services/control-articulos.service';
@Component({
  selector: 'app-detalle-control-articulos',
  templateUrl: './detalle-control-articulos.component.html',
  styleUrls: ['./detalle-control-articulos.component.css'],
})
export class DetalleControlArticulosComponent implements OnInit {
  detalle: any = {};

  idControlArticulos: string = '';

  articulosArray: Array<any> = [
    'adasdasdasdasdas',
    'asdasdasdasdasdasd',
    'asdasdasdasdas',
    'asdasdasasddas',
  ];

  constructor(
    private controlArticulosService: ControlArticulosService,
    private rutaActiva: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idControlArticulos = this.rutaActiva.snapshot.paramMap.get('id');
    console.log(this.idControlArticulos);
    this.buscarDetalleArticulos(this.idControlArticulos);
  }

  buscarDetalleArticulos(idControlArticulo: string) {
    let datos = {
      bitacora: {
        aplicativo: '',
        flujo: '',
        idUsuario: 1,
        nombreUsuario: '',
        tipoUsuario: 1,
      },
      idCa: idControlArticulo,
    };

    this.controlArticulosService.getDetalleControlArticulos(datos).subscribe(
      (res: any) => {
        try {
          let response = res.response;
          let estatus = response.status;
          if (estatus == 'OK') {
            let controlArticulos = response.controlArticulosDto;
            let articulos = controlArticulos.articulosArray;
            this.articulosArray = articulos;
            this.detalle = controlArticulos;
            console.log(controlArticulos);
          }
        } catch (error) {
          console.error(error);
        }
      },
      (error: any) => {
        console.log('fallo y no se porque');
        console.log(error);
      }
    );
  }

  impirmiControlArticulos() {

    let nombrePaciente="Maria del Carmen Romero Sanchez";
    let splitNombre=nombrePaciente.split(" ");
    let tamanioNombre=splitNombre.length;
    let posicionAppMaterno=tamanioNombre-1;
    let posicionAppPaterno=tamanioNombre-2;

    console.log(splitNombre)
    let appPaterno=splitNombre[posicionAppPaterno];
    let appMaterno=splitNombre[posicionAppMaterno];
   let nombre="";
    for (let i = 0; i < posicionAppMaterno; i++) {
      console.log(splitNombre[i])
      nombre+=splitNombre[i]+" ";      
    }
    let recepcionFechaSA=this.detalle.resguardoFecha;
    let diaRecepcionSA="";
    let anioRecepionSA="";
    let mesResguardoSA="";
    if(recepcionFechaSA!=null && recepcionFechaSA!=""){
      try {
        let splitResguardoFecha=recepcionFechaSA.split("/");  
        diaRecepcionSA= splitResguardoFecha[0];
        mesResguardoSA=splitResguardoFecha[1];
         anioRecepionSA=splitResguardoFecha[2];
      } catch (error) {
        console.error(error);
      }
     
    }

    let resguardoHora=this.detalle.resguardoHora;
    let horaResguardo="";
     if(resguardoHora!=null && resguardoHora!=""){
      try {
        let splitHora= resguardoHora.split(":");
      let tipohorario=Number(splitHora[0]) > 11 ? "PM": "AM";
      horaResguardo=splitHora[0]+":"+splitHora[1]+" "+tipohorario;
      } catch (error) {
        console.error(error)
      }
            
     }


    let recepcionFecha=this.detalle.recepcionFecha;
    let diaRecepcion="";
    let anioRecepion="";
    let mesResguardo="";
    if(recepcionFecha!=null && recepcionFecha!=""){
      try {
        let splitResguardoFecha=recepcionFecha.split("/");  
        diaRecepcion= splitResguardoFecha[0];
         mesResguardo=splitResguardoFecha[1];
         anioRecepion=splitResguardoFecha[2];
      } catch (error) {
        console.error(error);
      }
     
    }

    let recepcionHora=this.detalle.recepcionHora;
    let horaRecepcion="";
     if(recepcionHora!=null && recepcionHora!=""){
      try {
        let splitHora= recepcionHora.split(":");
      let tipohorario=Number(splitHora[0]) > 11 ? "PM": "AM";
      horaRecepcion=splitHora[0]+":"+splitHora[1]+" "+tipohorario;
      } catch (error) {
        console.error(error)
      }
            
     }
    
  
    let data: any = {
      folio: this.detalle.noFolioControl,
      uMedica: '1M1989OR',
      paternoP: appPaterno,
      maternoP: appMaterno,
      nombreP: nombre,
      cama:  this.detalle.noCama,
      nss: 'UMD No. 11',
      servicio: this.detalle.ubicacion,
      tel1: this.detalle.telefono,
      articulos: this.detalle.articulosArray,
      diaSA: diaRecepcionSA,
      mesSA: mesResguardoSA,
      añoSA: anioRecepionSA,
      horaSA: horaResguardo,
      nombreTS: this.detalle.trabajadorNombreRecibe,
      nombrePE: this.detalle.enfermeriaNombreEntrega,
      diaR: diaRecepcion,
      mesR: mesResguardo,
      añoR: anioRecepion,
      horaR: horaRecepcion,
      ubicacionEntrega:  this.detalle.recepcionUbicacion,
      horarioEntrega:this.detalle.recepcionHorarioEntregaArticulo,
      nombreTSC: 'Manuel Avila Camacho',
      matriculaTSC: '5542468958',
    };
    console.log('DATA REPORT: ', data);
    this.controlArticulosService.downloadPdf(data).subscribe(
      (response: any) => {
        console.log(response);
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


