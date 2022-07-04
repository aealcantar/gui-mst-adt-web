import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn } from '@angular/forms'
import { AlertInfo } from 'src/app/shared-modules/models/app-alert.interface';
import { Validators } from '@angular/forms';
import { Municipio } from '../../models/municipio.model';
import { EstudioSocialMedicoService } from '../../services/estudio-social.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Ciudad } from '../../models/ciudad.model';
import { Estado } from '../../models/estado.model';
import { CronicaGrupalService } from '../../services/cronica-grupal.service';
import { VolantesDonacionService } from '../../services/volantes-donacion.service';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';
declare var $: any;

@Component({
  selector: 'app-nuevo-vdonacion-sangre',
  templateUrl: './nuevo-vdonacion-sangre.component.html',
  styleUrls: ['./nuevo-vdonacion-sangre.component.css']
})
export class NuevoVdonacionSangreComponent implements OnInit {
  submitted:boolean=false;
  formNuevaDonacion: any = this.formBuilder.group({
    umh: new FormControl('',Validators.required),
    fecha: new FormControl('' ),
    idBancoSangre: new FormControl('',Validators.required),
    horaInicialAtencion:new FormControl('',Validators.required),
    horaFinalAtencion:new FormControl('',Validators.required),
    codigoPostal:new FormControl('',Validators.required),
    idEstado:new FormControl('',Validators.required),
    idDelegacion:new FormControl('',Validators.required),
    idCiudad:new FormControl('',Validators.required),
    colonia:new FormControl('',Validators.required),
    calle:new FormControl('',Validators.required),
    numExterior:new FormControl('',Validators.required),
    numInterior:new FormControl('',Validators.required),
    nombrePaciente:new FormControl(''),
    desNSS:new FormControl(''),
    idServicio:new FormControl('',Validators.required),
    fechaInternamiento:new FormControl('' ),
    fechaCirugia:new FormControl('' ),
    numTelefonoPaciente:new FormControl('',Validators.required),
    nombreTrabajadorSocial:new FormControl('',Validators.required),
    matriculaTrabajadorSocial:new FormControl('',Validators.required),
    numTelefonoTrabajadorSocial:new FormControl('',Validators.required),
    observaciones:   new FormControl('',Validators.required),
    fecha1:new FormControl('',Validators.required),
    fecha2:new FormControl('',Validators.required),
    fecha3: new FormControl('',Validators.required),


  });
  estadosFamiliar: Estado[] = [];
  ciudadesFamiliar: Ciudad[] = [];
  delegaciones: Municipio[] = [];
  listaServicios: Array<any> = [];
  alert!: AlertInfo;


  paciente!: pacienteSeleccionado;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private estudioSocialService: EstudioSocialMedicoService,
    private cronicaGrupalService: CronicaGrupalService,
    private volantesDonacionService:VolantesDonacionService,
    private tarjetaService: AppTarjetaPresentacionService,
  ) { }

  ngOnInit(): void {
    this.estados();
    this.servicios() ;

    this.paciente = this.tarjetaService.get();
    
    if (this.paciente !== null && this.paciente !== undefined) {
      let nss = this.paciente.nss;
      let nombrePaciente = this.paciente.paciente;
      this.formNuevaDonacion.controls['nombrePaciente'].setValue(nombrePaciente);
      this.formNuevaDonacion.controls['desNSS'].setValue(nss);
    }
  }


  ngAfterViewInit(): void {
    $('#fecha1').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') { 
          this.formNuevaDonacion.controls['fecha1'].setValue(date);
        }
      },

    });
    $('#fecha2').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') { 
          this.formNuevaDonacion.controls['fecha2'].setValue(date);
        }
      },

    });
    $('#fecha3').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') { 
          this.formNuevaDonacion.controls['fecha3'].setValue(date);
        }
      },

    });
    
  }


  servicios() {
    this.cronicaGrupalService
      .getCatServicios()
      .toPromise()
      .then(
        (res) => { 
          this.listaServicios = res;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }

  registarDonacion(formNuevaDonacion:FormGroup){
    this.submitted=true;

    if(formNuevaDonacion.status != "INVALID"){
 
let fechaa= formNuevaDonacion.value.fecha1.split("/");
let fechaNew = fechaa[2] + "/" + fechaa[1] + "/" + fechaa[0];
let fechaI  = formNuevaDonacion.value.fecha2.split("/");
let fechaInternamiento = fechaI[2] + "/" + fechaI[1] + "/" + fechaI[0];
let fechaC  = formNuevaDonacion.value.fecha3.split("/");
let fechaCirugia = fechaC[2] + "/" + fechaC[1] + "/" + fechaC[0];
this.formNuevaDonacion.controls['fecha'].setValue(fechaNew);  
this.formNuevaDonacion.controls['fechaInternamiento'].setValue(fechaInternamiento);  
this.formNuevaDonacion.controls['fechaCirugia'].setValue(fechaCirugia );  
 
let datos =  JSON.stringify(this.formNuevaDonacion.value);
      this.volantesDonacionService.addVolante(datos).subscribe(async (res: any) => {
        
        
        let estatus=res.status;
        if(estatus=="OK"){
          let id = res.idVolanteDonacionSangre + "nuevo";
          await this.router.navigateByUrl("/detalle-volante-donacion-sangre/" + id, { skipLocationChange: true });
        }else{
          this.muestraAlerta(
            '¡La información no se pudo guardar, intente más tarde!',
            'alert-danger',
            'Error'
          );
        }
       
       
        console.log(res)
   
      }, (error: any) => {
        this.muestraAlerta(
          '¡La información no se pudo guardar, intente más tarde!',
          'alert-danger',
          'Error'
        );
        console.error(error);
      });

    }else{
      this.muestraAlerta(
        'Verificar datos capturados',
        'alert-danger',
        'Error'
      );
      return;
    }
 
  }

estados(){
  this.estudioSocialService.getCatEstados().toPromise().then(
    (estadosFamiliar: Estado[]) => {
      this.estadosFamiliar = estadosFamiliar;
      console.log("ESTADOS FAMILIAR: ", this.estadosFamiliar);
    },

    (httpErrorResponse: HttpErrorResponse) => {
      console.error(httpErrorResponse);
    }
  );
}


  onChangeEstado(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.formNuevaDonacion.get('idEstado').value).toPromise().then(
      (delegaciones: Municipio[]) => {
        this.delegaciones = delegaciones; 
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }


  onChangeMunicipio(): void {
    this.estudioSocialService.getCiudadByEstadoMunicipio(this.formNuevaDonacion.get('idEstado').value,
      this.formNuevaDonacion.get('idDelegacion').value).toPromise().then(
        (ciudades: Ciudad[]) => {
          this.ciudadesFamiliar = ciudades; 
          if (this.ciudadesFamiliar.length === 1) {
            this.formNuevaDonacion.controls['idCiudad'].setValue(this.ciudadesFamiliar[0].cve_ciudad);
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }


  modalcarga() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelarModal() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/consulta-volante", { skipLocationChange: true });
    $('#content').modal('hide');
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
