import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { CronicaGrupalService } from '../../services/cronica-grupal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlArticulosService } from '../../services/control-articulos.service'; 
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AlertInfo } from 'src/app/shared-modules/models/app-alert.interface';

declare var $: any;
@Component({
  selector: 'app-nuevo-control-articulos',
  templateUrl: './nuevo-control-articulos.component.html',
  styleUrls: ['./nuevo-control-articulos.component.css'],
})
export class NuevoControlArticulosComponent implements OnInit, AfterViewInit {
  //variables
  alert!: AlertInfo;
  submitted: boolean = false;
  mostrarArticulos: boolean = false;
  articulo: string = '';
  @ViewChild("cancelarModal")
  cancelarModal!: TemplateRef<any>;
  validaArticulos: boolean = false;

  //datos generales del usuario logueado
  bitacora = {
    aplicativo: '',
    flujo: '',
    idUsuario: 1,
    nombreUsuario: '',
    tipoUsuario: 1
  };

  nuevosArticulosArray: Array<any> = [];
  listaServicios: Array<any> = [];
  listaUbicacion: Array<any> = [];
  listaDeHorarios: Array<any> = [];


  fecha = moment(Date.now()).format('DD/MM/YYYY');
  hora = moment(Date.now()).format('HH:mm');

  formNuevoArticulo: any = this.formBuilder.group({
    clavePaciente: new FormControl(''),
    bitacora: new FormControl(this.bitacora, Validators.required),
    personalQueElaboro: new FormControl(''),
    idCa: new FormControl(''),
    noFolioControl: new FormControl(''),
    fecha: new FormControl("", [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/), Validators.maxLength(10)]),
    noCama: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    servicio: new FormControl('',[ Validators.required]),
    // telefono: new FormControl('', Validators.required),
    telefono: new FormControl(''),
    articulo: new FormControl(''),
    articulosArray: new FormControl(this.nuevosArticulosArray),
    trabajadorNombreRecibe: new FormControl(''),
    enfermeriaNombreEntrega: new FormControl('', [Validators.required]),
    ubicacion: new FormControl('', Validators.required),
    // horarioEntregaArticulo: new FormControl('', Validators.required),
    horarioEntregaArticulo: new FormControl('', [Validators.required,
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
    resguardoFecha: new FormControl('', [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/)]),
    resguardoHora: new FormControl('', [Validators.required, Validators.maxLength(5),
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
    resguardoNombreRecibe: new FormControl('',[ Validators.required, Validators.maxLength(150)]),
    resguardoNombreEntrega: new FormControl('', [Validators.required,Validators.maxLength(150)]),
    recepcionFecha: new FormControl('', [Validators.required,
    Validators.pattern(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})/)]),
    recepcionHora: new FormControl('', [Validators.required,Validators.maxLength(5),
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
    recepcionNombreRecibe: new FormControl('', [Validators.required,Validators.maxLength(150)]),
    recepcionNombreEntrega: new FormControl('', [Validators.required,Validators.maxLength(150)]),
    recepcionUbicacion: new FormControl('', Validators.required),
    recepcionHorarioEntregaArticulo: new FormControl('', [Validators.required,Validators.maxLength(5),
    Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),

  });

 
  paciente!: pacienteSeleccionado;

  constructor(
    private formBuilder: FormBuilder,
    private controlArticulosService: ControlArticulosService,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService,
    private dialog: MatDialog,
    private tarjetaService: AppTarjetaPresentacionService,

  ) { }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    this.paciente = this.tarjetaService.get();
    if (this.paciente !== null && this.paciente !== undefined) {
      let nss = this.paciente.nss;
      this.formNuevoArticulo.controls['clavePaciente'].setValue(nss);
    }

    if (userTmp !== '') {
      let usuario = JSON.parse(userTmp);
      let nombre = usuario?.strNombres + " " + usuario?.strApellidoP + " " + usuario?.strApellidoM;
      let rolUser = usuario?.rolUser;

      this.formNuevoArticulo.controls['personalQueElaboro'].setValue(nombre);
      this.formNuevoArticulo.controls['trabajadorNombreRecibe'].setValue(nombre);
      this.formNuevoArticulo.controls['resguardoNombreRecibe'].setValue(nombre);
      this.bitacora = {
        aplicativo: 'control-articulos',
        flujo: 'post',
        idUsuario: 1,
        nombreUsuario: nombre,
        tipoUsuario: rolUser
      };


    } else {

      this.formNuevoArticulo.controls['personalQueElaboro'].setValue("Roberto García");
      this.formNuevoArticulo.controls['trabajadorNombreRecibe'].setValue("Roberto García");
      this.formNuevoArticulo.controls['resguardoNombreRecibe'].setValue("Roberto García");
    }

    this.servicios();
    this.formNuevoArticulo.controls['fecha'].setValue(this.fecha);
    this.formNuevoArticulo.controls['recepcionFecha'].setValue(this.fecha);
    this.formNuevoArticulo.controls['resguardoFecha'].setValue(this.fecha);
    this.formNuevoArticulo.controls['resguardoHora'].setValue(this.hora);
    this.formNuevoArticulo.controls['recepcionHora'].setValue(this.hora);
    this.formNuevoArticulo.controls['horarioEntregaArticulo'].setValue(this.hora);
    this.formNuevoArticulo.controls['recepcionHorarioEntregaArticulo'].setValue(this.hora);
    // this.horarioEntrega();


  }


  //asignacion del calendario 
  ngAfterViewInit(): void {
    $('#fecha').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevoArticulo.controls['fecha'].setValue(date);
        }
      },
    });
    $('#resguardoFecha').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevoArticulo.controls['resguardoFecha'].setValue(date);
        }
      },
    });
    $('#recepcionFecha').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.formNuevoArticulo.controls['recepcionFecha'].setValue(date);
        }
      },
    });
  }

  //busca todos los servicios disponibles
  servicios() {
    this.cronicaGrupalService
      .getCatServicios()
      .toPromise()
      .then(
        (res) => {
          console.log(res)
          this.listaServicios = res;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }

  //busca la ubicacion relacionada con el servicio
  ubicacion(idServicio: string) {
    this.cronicaGrupalService.getCatLugar(idServicio).subscribe(
      (lugares) => {
        this.listaUbicacion = lugares;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  //horarios
  /*   horarioEntrega() {
      this.controlArticulosService.getHorarios().subscribe((res: any) => {
        try {
          let response = res.response;
          let estatus = response.status;
          if (estatus == "OK") {
            this.listaDeHorarios = response.listaDeHorarios;
          } else {
            console.log(res)
          }
  
        } catch (error) {
          console.error(res);
          console.error(error)
        }
  
      }, (error: any) => {
        console.error(error);
      });
  
  
    } */


  //guarda los datos del formulario
  guardarControl() {

    this.submitted = true;

    let noArticulos = this.nuevosArticulosArray.length;
    if (noArticulos == 0) {
      this.validaArticulos = true;
    } else {
      this.validaArticulos = false;
    }
    console.log(this.formNuevoArticulo.value)
    if (this.formNuevoArticulo.status != "INVALID") {
      //validaciones para que los campos no vayan vacios 
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['noCama'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      // if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
      //   this.formNuevoArticulo.controls['telefono'].setValue(null);
      //   return;
      // }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['trabajadorNombreRecibe'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['enfermeriaNombreEntrega'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['ubicacion'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['horarioEntregaArticulo'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['resguardoFecha'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['resguardoHora'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['resguardoNombreRecibe'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['resguardoNombreEntrega'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionFecha'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionHora'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionNombreRecibe'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionNombreEntrega'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionUbicacion'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      if (this.formNuevoArticulo.value.noCama.trim().length == 0 ? true : false) {
        this.formNuevoArticulo.controls['recepcionHorarioEntregaArticulo'].setValue(null);
        this.muestraAlerta(
          'Verificar datos capturados',
          'alert-danger',
          'Error'
        );
        return;
      }
      let datos = this.formNuevoArticulo.value;
      this.controlArticulosService.setControlArticulos(datos).subscribe(async (res: any) => {

        let estatus = res.status;
        if (estatus == "OK") {
          try {
            console.log("insert correcto")
            let id = res.idCa + "nuevo";
            await this.router.navigateByUrl("/detalle-control-articulos/" + id, { skipLocationChange: true });

          } catch (error) {
            this.muestraAlerta(
              '¡La información no se pudo guardar, intente más tarde!',
              'alert-danger',
              'Error'
            );
          }
        } else {
          this.muestraAlerta(
            '¡La información no se pudo guardar, intente más tarde!',
            'alert-danger',
            'Error'
          );
        }
      }, (error: any) => {
        this.muestraAlerta(
          '¡La información no se pudo guardar, intente más tarde!',
          'alert-danger',
          'Error'
        );
        console.error(error);
      });


    } else {
      this.muestraAlerta(
        ' Verificar datos capturados',
        'alert-danger',
        'Error'
      );

      return;
    }


  }

 


  //despliega la ventana emergente con la opcion de cancelar
  cancelar(modal: any) {
    this.dialog.open(modal, {
       width: "450px",
      maxHeight: "350px"
    });

  }

 

  //al dar click en la ventana emergente y da en la opcion de aceptar se redirecciona
   cancelarSinGuardar() { 
    this.router.navigateByUrl("/consulta-control-articulos", { skipLocationChange: true });
   
  }

  //agrega articulos a la lista
  agegarArticulo() {
    let articulo = this.formNuevoArticulo.value.articulo;

    if (articulo.trim().length == 0 ? true : false) {
      return;
    }

    this.nuevosArticulosArray.push(articulo.trim());
    this.formNuevoArticulo.controls['articulo'].setValue('');
    this.mostrarArticulos = true;

    let noArticulos = this.nuevosArticulosArray.length;
    if (noArticulos == 0) {
      this.validaArticulos = true;
    } else {
      this.validaArticulos = false;
    }
  }


  //elmina el articulo de la lista
  eliminarArticulo(articulo: string) {
    let i = this.nuevosArticulosArray.indexOf(articulo);

    if (i !== -1) {
      this.nuevosArticulosArray.splice(i, 1);
    }

    if (this.nuevosArticulosArray.length == 0) {
      this.mostrarArticulos = false;
    } else {
      this.mostrarArticulos = true;
    }

    let noArticulos = this.nuevosArticulosArray.length;
    if (noArticulos == 0) {
      this.validaArticulos = true;
    } else {
      this.validaArticulos = false;
    }
  }

  //si selecciona un servicio diferente cambia la ubicacion
  onChangeServicio() {
    let idServicio = this.formNuevoArticulo.value.servicio;
    if (idServicio != '' && idServicio != null) {
      //  idServicio = '1';
      this.ubicacion(idServicio);
    }
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



}
