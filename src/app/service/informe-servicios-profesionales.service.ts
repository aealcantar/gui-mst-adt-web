import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InformeServiciosProfesionalesService {

  constructor(private http: HttpClient) { }

  getCatLugar(cveServicio: string) {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/${cveServicio}`);
  }
  
  getCatServicios() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listservicios`);
  }

  getCatTurnos() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listTurnos`);
  }

}
