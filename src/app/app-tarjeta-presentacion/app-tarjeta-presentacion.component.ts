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

  @Input() mostrarBtnAtras: boolean = false;
  @Input() url: string = "";

  constructor(private tarjetaService: AppTarjetaPresentacionService, private router: Router) { }

  ngOnInit(): void {
    this.paciente = this.tarjetaService.get();
    if (!this.paciente) {
      this.paciente = JSON.parse(localStorage.getItem('paciente')!);
    }
    this.convertDate();
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

  convertDate() {
    if (!this.executed) {
      this.executed = true;
      // let stringDate = this.paciente.fechaNacimiento.substring(3, 5) + "-" + this.paciente.fechaNacimiento.substring(0, 2) + "-" + this.paciente.fechaNacimiento.substring(6, 10);
      let birthDate = new Date();
      // console.log("FECHA: ", birthDate);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      this.months = today.getMonth() - birthDate.getMonth();
      if (this.months < 0 || (this.months === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // console.log("EDAD: ", age);
      if (this.months > 0) {
        // console.log("MESES: ", this.months);
        this.months = this.months;
      } else {
        this.months = this.months + 12;
        // console.log("MESES: ", this.months);
      }
    }
    return this.months + " meses";
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
