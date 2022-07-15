import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class DetalleCertificadoComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private certificadoService: CertificadoDefuncionService,
    private usuarioService: UsuariosService,
    private cronicaGrupalService: CronicaGrupalService
  ) {}
  ngOnDestroy(): void {
    sessionStorage.removeItem('certificadoDefuncion');
  }
  certificado: CertificadoDefuncion;
  usuario!: Usuario;
  servicio: any;
  servicios: Array<any>;
  async ngOnInit() {
    this.certificado = await JSON.parse(
      sessionStorage.getItem('certificadoDefuncion')
    );
  }
  cancelarSinGuardar() {}

  imprimir() {
    if (this.certificado !== undefined) {
      this.certificadoService.imprimir(this.certificado.idDefuncion).subscribe(
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
