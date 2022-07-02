import { Component, Input, OnInit } from '@angular/core'
import { AppTarjetaPresentacionService } from './../services/app-tarjeta-presentacion.service'
import { ActivatedRoute, Router } from '@angular/router'
import { pacienteSeleccionado } from '../models/paciente.interface'

declare var $: any

@Component({
  selector: 'app-fichapaciente',
  templateUrl: './fichapaciente.component.html',
  styleUrls: ['./fichapaciente.component.css'],
})
export class FichapacienteComponent implements OnInit {
  paciente!: pacienteSeleccionado
  isCollapsed: boolean = true
  executed: boolean = false
  months: any
  @Input() mostrarBtnAtras: boolean = false;
  @Input() url: string = "";
  constructor(
    private tarjetaServce: AppTarjetaPresentacionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.paciente = this.tarjetaServce.get()
    this.convertDate()
  }

  validaTurno(turno: any) {
    if (turno === 'M') {
      turno = 'Matutino'
    } else if (turno === 'V') {
      turno = 'Vespertino'
    }
    return turno
  }

  validaSexo(sexo: any) {
    if (sexo === 'M') {
      sexo = 'Masculino'
    } else if (sexo === 'F') {
      sexo = 'Femenino'
    }
    return sexo
  }

  convertDate() {
    if (!this.executed) {
      this.executed = true
      // let stringDate =
      //   this.paciente.fechaNacimiento.substring(3, 5) +
      //   '-' +
      //   this.paciente.fechaNacimiento.substring(0, 2) +
      //   '-' +
      //   this.paciente.fechaNacimiento.substring(6, 10);
      //   console.log(stringDate)
      // let birthDate = new Date(stringDate)
      // console.log('FECHA: ', birthDate)
      // let today = new Date()
      // let age = today.getFullYear() - birthDate.getFullYear()
      // this.months = today.getMonth() - birthDate.getMonth()
      // if (
      //   this.months < 0 ||
      //   (this.months === 0 && today.getDate() < birthDate.getDate())
      // ) {
      //   age--
      // }
      // console.log('EDAD: ', age)
      // if (this.months > 0) {
      //   console.log('MESES: ', this.months)
      //   this.months = this.months
      // } else {
      //   this.months = this.months + 12
      //   console.log('MESES: ', this.months)
      // }

      //calcula la edad con meses si es necesario 
      try { 
        if(this.paciente!=undefined && this.paciente!=null){
          let fecha = this.paciente.fechaNacimiento.split("/");
          let fechaNacimientoStr = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
          let fechaNacimiento = new Date(fechaNacimientoStr);
    
          let diaN = fechaNacimiento.getDate();
          let mesN = fechaNacimiento.getMonth() + 1;
          let anioN = fechaNacimiento.getFullYear();
    
          let fechaActual = new Date();
          let diaA = fechaActual.getDate();
          let mesA = fechaActual.getMonth() + 1;
          let anioA = fechaActual.getFullYear();
    
          let mesAdicional = 0;
    
          if (diaN > diaA) {
            mesAdicional = 1;
          }
    
          let anioAdicional = 0;
          if (mesN > mesA) {
            mesA = Number(mesA) + 12;
            anioAdicional = 1;
          }
    
          let meses = Number(mesA) - (Number(mesN) + Number(mesAdicional));
          this.months = meses;
        }
       
      } catch (error) {
        console.log(error)
      }
 
      //calcula los años
    //  let aniosEdad=Number(anioA)-(Number(anioN)+Number(anioAdicional))
 


    }
    return this.months + ' meses'
  }

  irNotasDeTrabajo() {
    this.router.navigateByUrl('/consulta-notas', { skipLocationChange: true })
  }

  irEstudioSocialMedico() {
    this.router.navigateByUrl('/consulta-estudios-medicos', {
      skipLocationChange: true,
    })
  }

  irControlDeArticulos() {
    this.router.navigateByUrl('/consulta-control-articulos', {
      skipLocationChange: true,
    })
  }

  irDonacionDeSangre() {
    this.router.navigateByUrl('/consulta-volante', {
      skipLocationChange: true,
    })
  }

  irMinisterioPublico() {
    this.router.navigateByUrl('/consulta-aviso-mp', {
      skipLocationChange: true,
    })
  }

  irSertificadoDefuncion() {
    this.router.navigateByUrl('/consulta-volante', {
      skipLocationChange: true,
    })
  }

  irAgenda() {
    this.router.navigateByUrl('/buscacita', { skipLocationChange: true })
  }

  regresar() {
    this.router.navigateByUrl("/" + this.url, { skipLocationChange: true });
  }

 

}