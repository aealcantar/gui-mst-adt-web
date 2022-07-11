import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CertificadoDefuncion } from '../models/certificado-defuncion.model';

@Injectable({
  providedIn: 'root',
})
export class CertificadoDefuncionService {
  constructor(private http: HttpClient) {}

  insert(certificado: CertificadoDefuncion) {
    return this.http.post<CertificadoDefuncion>(
      environment.msmtsControlInterno + 'insert',
      certificado
    );
  }
  findById() {}
  list() {}
}
