import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InformeServicios } from '../models/informe-servicios.model';


@Injectable({
  providedIn: 'root'
})
export class InformeServiciosService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getCatServicios() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listservicios`);
  }

  getCatTurnos() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listTurnos`);
  }

  getCatLugar(cveServicio: string) {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/${cveServicio}`);
  }
  
  getCatResponsable() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listTurnos`);
  }

  getInformesServiciosByFiltros(cveServicio: string, cveTurno: number, cveUbicacion: string, fecha: string | null, especialidadEspecifica: string) {
    return this.http.get<any>(`${environment.msmtsCronicas}/filtrocronicas/${cveServicio}/${cveTurno}/${cveUbicacion}/${fecha}/${especialidadEspecifica}`);
  }

  downloadPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType: 'blob' });
    return this.http.post<Blob>(environment.msmtsCronicas + '/reporteCronica', JSON.stringify(data),
    { headers: headers, responseType: 'blob' as 'json'});
  }

}