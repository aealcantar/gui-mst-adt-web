import { Component, OnInit } from '@angular/core';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';

@Component({
  selector: 'app-detalle-certificado',
  templateUrl: './detalle-certificado.component.html',
  styleUrls: ['./detalle-certificado.component.css'],
})
export class DetalleCertificadoComponent implements OnInit {
  constructor() {}
  certificado: CertificadoDefuncion;
  ngOnInit(): void {
    this.certificado = JSON.parse(sessionStorage.getItem('certificadoDefuncion'))
  }
  cancelarSinGuardar() {}
}
