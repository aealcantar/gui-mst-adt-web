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
    console.log(JSON.stringify(certificado));
    return this.http.post<CertificadoDefuncion>(
      environment.msmtsControlInterno + '/insert',
      certificado
    );
  }
  imprimir(certificadoId: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const opt = {
      headers,
      responseType: 'blob' as 'json',
      params: {
        certificadoId,
      },
    };

    return this.http.get<any>(
      environment.msmtsControlInterno + '/getReporte',
      opt
    );
  }
  findById(idDefuncion: any) {
    const opt = {
      params: {
        idDefuncion,
      },
    };
    return this.http.get<CertificadoDefuncion>(
      environment.msmtsControlInterno + '/id',
      opt
    );
  }
  list(fechaInicio: string,fechaFin: string,pagina: any,count: any,criterio?: any) {
    const opt = {params: {fechaInicio,fechaFin,pagina,count, orden: criterio != undefined ? criterio : '',},};
    return this.http.get<CertificadoDefuncion[]>(environment.msmtsControlInterno + '/list', opt );
  }

  obtenerListaCertificados(criteriosBusqueda: any){
    return this.http.post<any>(`${environment.msmtsControlInterno}/list`, criteriosBusqueda);
  }

  getPagination(fechaInicio: string, fechaFin: string) {
    const opt = {
      params: {
        fechaInicio,
        fechaFin,
      },
    };
    return this.http.get<any>(
      environment.msmtsControlInterno + '/getPagination',
      opt
    );
  }
}
