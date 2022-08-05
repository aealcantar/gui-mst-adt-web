import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeServiciosProfesionalesService {

  constructor(private http: HttpClient) { }

  getCatLugar() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/`)
  }

  getCatServicios() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listservicios`);
  }

  getCatTurnos() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listTurnos`);
  }

  getCatResponsables() {
    return this.http.get<any>(`${environment.msmtsServsProfesionales}/responsables`)
  }

  getConsultaServicios(query?: any) {
    if (!query) {
      const request = {};
      return this.http.post<any>(`${environment.msmtsServsProfesionales}/searchServiciosProfecionales`, request)
    }
    const { turno, responsable, servicio, lugar, fecha } = query
    const request = {
      idTurno: parseInt(turno),
      responsable,
      especialidad: parseInt(servicio),
      idLugar: parseInt(lugar),
      fecha,
    }
    return this.http.post<any>(`${environment.msmtsServsProfesionales}/searchServiciosProfecionales`, request)
  }

  imprimirPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
    return this.http.post<any>(`${environment.msmtsServsProfesionales}/reporteServiciosProfesionales4306P`, JSON.stringify(data),
      { headers, responseType: 'blob' as 'json' })
  }

}