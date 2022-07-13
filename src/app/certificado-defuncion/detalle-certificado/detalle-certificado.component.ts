import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-detalle-certificado',
  templateUrl: './detalle-certificado.component.html',
  styleUrls: ['./detalle-certificado.component.css'],
})
export class DetalleCertificadoComponent implements OnInit {
  constructor(
    private router: Router,
    private certificadoService: CertificadoDefuncionService,
    private usuarioService: UsuariosService,
    private cronicaGrupalService: CronicaGrupalService
  ) {}
  certificado: CertificadoDefuncion;
  usuario!: Usuario;
  servicio: any;
  servicios: Array<any>;
  async ngOnInit() {
    this.certificado = await JSON.parse(
      sessionStorage.getItem('certificadoDefuncion')
    );
    this.servicios = await this.cronicaGrupalService
      .getCatServicios()
      .toPromise();
    console.log(this.servicios);
    for (const item of this.servicios) {
      if (item.cve_especialidad == this.certificado.cveServicio) {
        this.servicio = item;
      }
    }
    if (this.servicio == undefined) {
      this.servicio = { cve_descripcion: 'Cardiología' };
    }
    console.log(this.servicio);
    this.usuario = await this.usuarioService
      .consultaUsuario(Number.parseInt(this.certificado.cvePersonalQueElaboro))
      .toPromise()
      .catch((error) => {
        this.usuario = new Usuario();
        this.usuario.strNombres = 'Alan Isaac';
        this.usuario.matricula = 'XXXXXX';
      });
    if (this.usuario == undefined) {
      this.usuario = new Usuario();
      this.usuario.strNombres = 'Alan Isaac';
      this.usuario.matricula = 'XXXXXX';
    }
  }
  cancelarSinGuardar() {}

  imprimir() {
    if (this.certificado !== undefined) {
      this.certificadoService
        .imprimir(
          this.certificado,
          this.usuario.matricula,
          this.usuario.strNombres
        )
        .subscribe(
          (response) => {
            console.log(response);
            const file = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);
            window.open(url);
          },
          (error) => {
            console.log(`Error en certificado de defuncnion`, error);
          }
        );
    }
  }
}
