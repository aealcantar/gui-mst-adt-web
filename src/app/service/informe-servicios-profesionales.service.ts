import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class InformeServiciosProfesionalesService {

  constructor(private http: HttpClient) { }

  getCatLugar() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/`);
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

  getConsultaServicios(query: any) {
    const { turno, responsable, servicio, lugar, fecha } = query
     const request = {
      idTurno: turno,
      responsable,
      idServicio: servicio,
      idLugar: lugar,
      fecha,
     }
    return this.http.post<any>(`${environment.msmtsServsProfesionales}/searchServiciosProfecionales`, request).pipe(
      tap(console.log)
    );
  }

}
