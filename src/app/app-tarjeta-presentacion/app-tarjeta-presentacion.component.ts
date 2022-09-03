import { Component, Input, OnInit } from '@angular/core';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
import { AppTarjetaPresentacionService } from './../app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-tarjeta-presentacion',
  templateUrl: './app-tarjeta-presentacion.component.html',
  styleUrls: ['./app-tarjeta-presentacion.component.css']
})
export class AppTarjetaPresentacionComponent implements OnInit {

  paciente!: pacienteSeleccionado;
  isCollapsed: boolean = true;
  executed: boolean = false;
  months: any;
   aniosNum: string;
   mesesNum: string;
   aniosText: string;
   mesesText: string;
   posicion3: string;

  @Input() mostrarBtnAtras: boolean = false;
  @Input() url: string = "";

  constructor(private tarjetaService: AppTarjetaPresentacionService, private router: Router) { }

  ngOnInit(): void {
    this.paciente = this.tarjetaService.get();
    if (!this.paciente) {
      this.paciente = JSON.parse(localStorage.getItem('paciente')!);
    }
    let edad = this.paciente.edad;
    //  this.aniosNum = edad[0];
    //  this.aniosText = edad[1];
    //   this.mesesNum = edad.split(' ')[6]
    //   this.mesesText = edad.split(' ')[7]

  }

  validaTurno(turno: any) {
    if (turno === 'M') {
      turno = "Matutino"
    } else if (turno === 'V') {
      turno = "Vespertino"
    }
    return turno;
  }

  validaSexo(sexo: any) {
    if (sexo === 'M') {
      sexo = "Masculino"
    } else if (sexo === 'F') {
      sexo = "Femenino"
    }
    return sexo;
  }

  irNotasDeTrabajo() {
    this.router.navigateByUrl("/consulta-notas");
  }


  irEstudioSocialMedico() {
    this.router.navigateByUrl("/consulta-estudios-medicos");
  }

  irControlDeArticulos(){
    this.router.navigateByUrl("/consulta-articulos");
  }

  irAgenda(){
    this.router.navigateByUrl("/buscacita");
  }

  iraVolantesSangre(){
    this.router.navigateByUrl("/consulta-volantes-donacion");
  }

  irAvisosMP(){
    this.router.navigateByUrl("/consulta-aviso-mp");
  }

  irSertificadoDefuncion(){
    this.router.navigateByUrl("/consulta-certificado-defuncion");
  }

  regresar() {
    this.router.navigateByUrl("/" + this.url, { skipLocationChange: true });
  }
}
