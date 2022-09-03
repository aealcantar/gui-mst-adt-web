import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlArticulosService } from 'src/app/service/control-articulos.service';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface';
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { formatDate } from '@angular/common'
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-detalle-control-articulos',
  templateUrl: './detalle-control-articulos.component.html',
  styleUrls: ['./detalle-control-articulos.component.css']
})
export class DetalleControlArticulosComponent implements OnInit {

  //declaracion de variables para el funcionamiento del aplicativo
  datetimeFormat = '';
  public usuario!: Usuario
  dateToday = new Date();
  detalle: any = {};
  alert!: AlertInfo;
  idControlArticulos: string = '';
  articulosArray: Array<any> = [];
  paciente!: pacienteSeleccionado;
  bitacora: any = {
    aplicativo: '',
    flujo: '',
    idUsuario: 1,
    nombreUsuario: '',
    tipoUsuario: 1,
  };
  nombreTSC: string = "";
  matricula: string = "";
  infoUnidad: any;
  estado: any;

  constructor(
    private controlArticulosService: ControlArticulosService,
    private rutaActiva: ActivatedRoute,
    private tarjetaService: AppTarjetaPresentacionService,
  ) {
    this.datetimeFormat = formatDate(
      this.dateToday,
      'dd/MM/yyyy hh:mm:ss aa',
      'en-ES',
    )
  }

  ngOnInit(): void {
    this.idControlArticulos = this.rutaActiva.snapshot.paramMap.get('id');
    this.paciente = this.tarjetaService.get();
    if (Number(this.idControlArticulos) > 0) {
      this.buscarDetalleArticulos();
    } else {
      this.muestraAlerta(
        '¡La información se guardo con éxito!',
        'alert-success',
        ''
      );
      this.idControlArticulos = this.idControlArticulos.replace("nuevo", "");
      this.buscarDetalleArticulos();
    }

    let userTmp = sessionStorage.getItem('usuario') || ''
    if (userTmp !== '') {
      this.usuario = JSON.parse(userTmp)
      console.log('USER DATA: ', this.usuario)
    }

    this.obtenerInfoUnidadMedicaByMatricula();

  }


  //realiza una peticion para mostra el detalle del articulo seleccionado
  buscarDetalleArticulos() {

    let userTmp = sessionStorage.getItem('usuario') || '';
    let rolUser = "";
    let cveUsuario = "";
    let nombre = "";
    if (userTmp !== '') {
      let usuario = JSON.parse(userTmp);
      nombre = usuario?.strNombres + " " + usuario?.strApellidoP + " " + usuario?.strApellidoM;
      this.nombreTSC = nombre;
      rolUser = usuario?.rolUser;
      cveUsuario = usuario?.cveUsuario;
      this.matricula = usuario?.matricula;
    }

    let datos = {
      bitacora: {
        aplicativo: 'detalle-contol-articulos',
        flujo: '',
        idUsuario: cveUsuario,
        nombreUsuario: nombre,
        tipoUsuario: rolUser,
      },
      idCa: this.idControlArticulos,
    };

    this.controlArticulosService.getDetalleControlArticulos(datos).subscribe(
      (res: any) => {
        try {
          let response = res;
          let estatus = response.status;
          if (estatus == 'OK') {
            let controlArticulos = response.controlArticulosDto;
            let articulos = controlArticulos.articulosArray;
            this.articulosArray = articulos;
            this.detalle = controlArticulos;
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


  obtenerInfoUnidadMedicaByMatricula() {
    let matricula = this.usuario.matricula
    this.controlArticulosService
      .obtenerInformacionTSPorMatricula(matricula)
      .subscribe(
        (res) => {
          this.infoUnidad = res.datosUsuario
          this.obtenerEstadoByUnidadMedica()
        },

        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
    console.log(this.infoUnidad)
  }

  obtenerEstadoByUnidadMedica() {
    this.controlArticulosService
      .obtenerEstadoporUnidadMedica(this.infoUnidad.unidadMedica)
      .subscribe(
        (res) => {
          this.estado = res[0]
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
  }


  //genera un archivo pdf para su descarga
  impirmiControlArticulos() {
    let nombrePaciente = "";
    let unidadMedica = "";
    let nss = "";

    if (this.paciente !== null && this.paciente !== undefined) {
      nss = this.paciente.nss.toString();
      nombrePaciente = this.paciente.paciente.toString();
      unidadMedica = this.estado.des_denominacion_unidad;
    }

    let splitNombre = nombrePaciente.split(" ");
    let fechaTransformada = this.datetimeFormat;

    let tamanioNombre = splitNombre.length;
    let posicionAppMaterno = tamanioNombre - 1;
    let posicionAppPaterno = tamanioNombre - 2;
    let appPaterno = splitNombre[posicionAppPaterno] == undefined ? "" : splitNombre[posicionAppPaterno];
    let appMaterno = splitNombre[posicionAppMaterno] == undefined ? "" : splitNombre[posicionAppMaterno];;
    let nombre = "";

    for (let i = 0; i < posicionAppPaterno; i++) {
      nombre += splitNombre[i] + " ";
    }
    let recepcionFechaSA = this.detalle.resguardoFecha;
    let diaRecepcionSA = "";
    let anioRecepionSA = "";
    let mesResguardoSA = "";
    if (recepcionFechaSA != null && recepcionFechaSA != "") {
      try {
        let splitResguardoFecha = recepcionFechaSA.split("/");
        diaRecepcionSA = splitResguardoFecha[0];
        mesResguardoSA = splitResguardoFecha[1];
        anioRecepionSA = splitResguardoFecha[2];
      } catch (error) {
        console.error(error);
      }

    }

    let resguardoHora = this.detalle.resguardoHora;
    let horaResguardo = "";
    if (resguardoHora != null && resguardoHora != "") {
      try {
        let splitHora = resguardoHora.split(":");
        let tipohorario = Number(splitHora[0]) > 11 ? "PM" : "AM";
        horaResguardo = splitHora[0] + ":" + splitHora[1] + " " + tipohorario;
      } catch (error) {
        console.error(error)
      }

    }


    let recepcionFecha = this.detalle.recepcionFecha;
    let diaRecepcion = "";
    let anioRecepion = "";
    let mesResguardo = "";
    if (recepcionFecha != null && recepcionFecha != "") {
      try {
        let splitResguardoFecha = recepcionFecha.split("/");
        diaRecepcion = splitResguardoFecha[0];
        mesResguardo = splitResguardoFecha[1];
        anioRecepion = splitResguardoFecha[2];
      } catch (error) {
        console.error(error);
      }

    }

    let recepcionHora = this.detalle.recepcionHora;
    let horaRecepcion = "";
    if (recepcionHora != null && recepcionHora != "") {
      try {
        let splitHora = recepcionHora.split(":");
        let tipohorario = Number(splitHora[0]) > 11 ? "PM" : "AM";
        horaRecepcion = splitHora[0] + ":" + splitHora[1] + " " + tipohorario;
      } catch (error) {
        console.error(error)
      }

    }

    let articulos = this.detalle.articulosArray;
    let nuevosArticulos = [];
    let contador = 0;
    for (let i = 0; i < articulos.length; i++) {
      contador++;
      let valor = {
        noArticulo: contador,
        articulo: articulos[i]
      };
      nuevosArticulos.push(valor);
    }

    let rangoFechas = this.detalle.recepcionHorarioEntregaArticulo.split('-');

    let data: any = {
      folio: this.detalle.noFolioControl,
      uMedica: unidadMedica,
      paternoP: appPaterno,
      maternoP: appMaterno,
      nombreP: nombre,
      cama: this.detalle.noCama,
      nss: nss,
      servicio: this.detalle.ubicacion,
      tel1: this.detalle.telefono,
      articulos: nuevosArticulos,
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
      fecImpresion: fechaTransformada,
      ubicacionEntrega: this.detalle.recepcionUbicacion,
      horarioEntrega: rangoFechas.length > 0 ?
        `DE ${rangoFechas[0].trim()} A ${rangoFechas[1].trim()} HRS` :
        this.detalle.recepcionHorarioEntregaArticulo,
      nombreTSC: this.detalle.personalQueElaboro,
      matriculaTSC: this.detalle.cvePersonalQueElaboro,
    };
    //  console.log('DATA REPORT: ', this.detalle);
    // console.log('DATA : ', data);
    this.controlArticulosService.downloadPdf(data).subscribe(
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

}
