import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CertificadoDefuncion } from '../models/certificado-defuncion.model';

@Injectable({
  providedIn: 'root',
})
export class CertificadoDefuncionService {
  constructor(private http: HttpClient) {}

  insert(certificado: CertificadoDefuncion) {
    return this.http.post<any>(
      environment.msmtsControlInterno + '/insert',
      certificado
    );
  }
  imprimir(
    certificado: CertificadoDefuncion,
    matricula: string,
    nomTSC: string
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const opt = {
      headers,
      responseType: 'blob' as 'json',
    };
    const data = {
      fecDefuncion: certificado.fechaDefuncion,
      hrDefuncion: certificado.horaDefuncion,
      folio: certificado.foliofuncion,
      nomAsegurado: certificado.nombreAsegurado,
      nss: certificado.nssPaciente,
      fecEntrega: certificado.fechaDeEntregaDeCertificado,
      hrEntrega: certificado.horaDeEntregaDeCertificado,
      servicio: certificado.cveServicio,
      funeraria: certificado.nombreFuneraria,
      observaciones: certificado.observaciones,
      nomFamiliar: certificado.nombreFamiliar,
      parentesco: certificado.parentescoFamiliar,
      matricula,
      nomTSC,
    };
    console.log(data);
    console.log(certificado);
    return this.http.post<any>(
      environment.msmtsControlInterno + '/reporteCertificadoDefuncion',
      JSON.stringify(data),
      opt
    );
  }
  findById(idDefuncion: number) {
    const body = {
      idDefuncion,
    };
    return this.http.post<CertificadoDefuncion>(
      environment.msmtsControlInterno + '/id',
      body
    );
  }
  list() {}
}
