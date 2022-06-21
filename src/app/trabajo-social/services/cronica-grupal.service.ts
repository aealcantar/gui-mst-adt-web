import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cronica } from '../models/cronica.model';


@Injectable({
  providedIn: 'root'
})
export class CronicaGrupalService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getCatServicios() {
    return this.http.get<any>(`${environment.urlServCatalogos}/api/listservicios`);
  }

  getCatTurnos() {
    return this.http.get<any>(`${environment.urlServCatalogos}/api/listTurnos`);
  }

  getCatGrupo(cveServicio: string) {
    return this.http.get<any>(`${environment.urlServCatalogos}/api/listPrograma/${cveServicio}`);
  }

  getCatLugar(cveServicio: string) {
    return this.http.get<any>(`${environment.urlServCatalogos}/api/listUbicacion/${cveServicio}`);
  }
  
  getCatDiagnosticosMedicos(texto: string) {
    return this.http.get<any>(`${environment.urlServCatalogos}/api/getCatalogoCieAutoComplete/${texto}`);
  }

  getAllCronicasGrupales() {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasgrupales`, { responseType: 'json'});
  }

  getCronicasGrupalesByServicioEspecialidad(cveServicio: string) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbyesp/${cveServicio}`);
  }

  getCronicasGrupalesByTurno(cveTurno: number) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbyturno/${cveTurno}`);
  }

  getCronicasGrupalesByGrupo(cveGrupo: number) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbygrupo/${cveGrupo}`);
  }

  getCronicasGrupalesByUbicacion(cveUbicacion: string) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbyubicacion/${cveUbicacion}`);
  }

  getCronicasGrupalesByFecha(fecha: string | null) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbyfecha/${fecha}`);
  }

  getCronicasGrupalesByEspecialidadEspecifica(especialidadEspecifica: string) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/cronicasbyespecif/${especialidadEspecifica}`);
  }

  getCronicasGrupalesByFiltros(cveServicio: string, cveTurno: number, cveGrupo: number, cveUbicacion: string, fecha: string | null, especialidadEspecifica: string) {
    return this.http.get<any>(`${environment.urlServCronicas}/msmts-cronica-grupal/api/filtrocronicas/${cveServicio}/${cveTurno}/${cveGrupo}/${cveUbicacion}/${fecha}/${especialidadEspecifica}`);
  }

  addCronica(cronica: Cronica) {
    return this.http.post(`${environment.urlServCronicas}/msmts-cronica-grupal/api/guardanueva/`, cronica);
  }

  downloadPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType: 'blob' });
    return this.http.post<Blob>(environment.urlServCronicasReporte + '/reporte/reporteCronica', JSON.stringify(data),
    { headers: headers, responseType: 'blob' as 'json'});
  }

}
