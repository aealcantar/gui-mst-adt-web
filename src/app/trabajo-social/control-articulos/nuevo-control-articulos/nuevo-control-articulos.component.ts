import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { CronicaGrupalService } from '../../services/cronica-grupal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlArticulosService } from '../../services/control-articulos.service';
import { objAlert } from 'src/app/shared-modules/models/alerta.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-nuevo-control-articulos',
  templateUrl: './nuevo-control-articulos.component.html',
  styleUrls: ['./nuevo-control-articulos.component.css'],
})
export class NuevoControlArticulosComponent implements OnInit, AfterViewInit {

  alert!: objAlert;
  submitted:boolean = false;
  mostrarArticulos: boolean = false;
  articulo: string = '';
@ViewChild("cancelarModal")
cancelarModal!: TemplateRef<any>;

  bitacora = {
    aplicativo: '',
    flujo: '',
    idUsuario: 1,
    nombreUsuario: 'leandro',
    tipoUsuario:1
  };

  nuevosArticulosArray: Array<any> = [];
  listaServicios: Array<any> = [];
  listaUbicacion: Array<any> = [];

  formNuevoArticulo: any = this.formBuilder.group({
    bitacora: new FormControl(this.bitacora, Validators.required),
    personalQueElaboro: new FormControl('', Validators.required),
    idCa: new FormControl('', Validators.required),
    noFolioControl: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    noCama: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    articulo: new FormControl(''),
    trabajadorNombreRecibe: new FormControl(''),
    enfermeriaNombreEntrega: new FormControl('', Validators.required),
    ubicacion: new FormControl('', Validators.required),
    horarioEntregaArticulo: new FormControl('', Validators.required),
    resguardoFecha: new FormControl('', Validators.required),
    resguardoHora: new FormControl('', Validators.required),
    resguardoNombreRecibe: new FormControl('', Validators.required),
    resguardoNombreEntrega: new FormControl('', Validators.required),
    recepcionFecha: new FormControl('', Validators.required),
    recepcionHora: new FormControl('', Validators.required),
    recepcionNombreRecibe: new FormControl('', Validators.required),
    recepcionNombreEntrega: new FormControl('', Validators.required),
    recepcionUbicacion: new FormControl('', Validators.required),
    recepcionHorarioEntregaArticulo: new FormControl('', Validators.required),
  });
 
  datosAlert = {
    message: "asdasd",
    type: 'success',
    visible: true
  };
  constructor(
    private formBuilder: FormBuilder,
    private controlArticulosService: ControlArticulosService,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService,
    private dialog:MatDialog
    
  ) {}

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    if (userTmp !== '') {
   let usuario= JSON.parse(userTmp);
     let nombre=usuario?.strNombres +" "+usuario?.strApellidoP+" "+usuario?.strApellidoM;
     this.formNuevoArticulo.controls['trabajadorNombreRecibe'].setValue(nombre);
     this.formNuevoArticulo.controls['resguardoNombreRecibe'].setValue(nombre);
   this.bitacora  ={
      aplicativo: '',
      flujo: '',
      idUsuario: 1,
      nombreUsuario:nombre,
      tipoUsuario:1
    };
     
    }else{
      this.formNuevoArticulo.controls['trabajadorNombreRecibe'].setValue("Roberto García");  
      this.formNuevoArticulo.controls['resguardoNombreRecibe'].setValue("Roberto García");  
    }
    this.servicios();
    this.ubicacion('1');

 
  }

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
          console.log(res);
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
        console.log(lugares);
        this.listaUbicacion = lugares;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  //guarda los datos del formulario
  guardarControl() {
    this.muestraAlerta(
      '¡La información se guardo con éxito!',
      'alert-success',
      'Success'
    );
    this.submitted = true;
    console.log(this.formNuevoArticulo.value);
    console.log(this.formNuevoArticulo.value.resguardoFecha);

    let datos= this.formNuevoArticulo.value;
    this.controlArticulosService.setControlArticulos(datos).subscribe((res:any)=>{
     console.log(res);
    },(error:any)=>{
      console.log(error);
    });
    
    
    
    

    if(this.formNuevoArticulo.status!="INVALID"){

      let datos= this.formNuevoArticulo.value;
      console.log(datos)


    }else{
      return;
    }
    console.log(
      this.formNuevoArticulo.controls.recepcionHorarioEntregaArticulo.errors
    );

  }

  
  muestraAlerta(mensaje: string, estilo: string, type: string){
 
    this.alert = {
      message: mensaje,
      type: estilo,
      typeMsg: type,
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message:'',
        type: 'custom',
        visible: false
      }
    }, 2000);
  }


  cancelar(modal:any) {
    this.dialog.open(modal,{disableClose:true,
    width:"450px",
    maxHeight:"350px"
  });
    console.log('cancelar');
  }


  soloCerrarVentanaEmergente(){
    this.dialog.closeAll();
  }

  cancelarSinGuardar(){
    this.dialog.closeAll();
    this.router.navigateByUrl("/consulta-control-articulos", { skipLocationChange: true });
  }
  //agrega articulos a la lista
  agegarArticulo() {
    let articulo = this.formNuevoArticulo.value.articulo;
    console.log(articulo);

    if (articulo.trim().length == 0 ? true : false) {
      return;
    }

    this.nuevosArticulosArray.push(articulo.trim());
    this.formNuevoArticulo.controls['articulo'].setValue('');
    this.mostrarArticulos = true;
  }


  //elmina el articulo
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
    console.log(this.nuevosArticulosArray);
  }

  //si selecciona un servicio diferente
  onChangeServicio() {
    let idServicio = this.formNuevoArticulo.value.servicio;
    if (idServicio != '' && idServicio != null) {
      idServicio = '1';
      this.ubicacion(idServicio);
    }
  }

  showSucces(msg: string) {
    this.datosAlert = {
      message: msg,
      type: 'success',
      visible: true
    }
    setTimeout(() => {
      this.datosAlert = {
        message: '',
        type: 'custom',
        visible: false
      }
    }, 2000);
  }


}
