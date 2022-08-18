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

  getCatLugarSolo() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/`)
  }

  getCatServicios() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listservicios`);
  }

  getCatTurnos() {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listTurnos`);
  }

  getCatGrupo(cveServicio: string) {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listPrograma/${cveServicio}`);
  }

  getCatLugar(cveServicio: string) {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion/${cveServicio}`);
  }

  getCatDiagnosticosMedicos(texto: string) {
    return this.http.get<any>(`${environment.urlMSEDSCatalogos}/getCatalogoCieAutoComplete/${texto}`);
  }

  getAllCronicasGrupales() {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasgrupales`, { responseType: 'json'});
  }

  getCronicasGrupalesByServicioEspecialidad(cveServicio: string) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbyesp/${cveServicio}`);
  }

  getCronicasGrupalesByTurno(cveTurno: number) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbyturno/${cveTurno}`);
  }

  getCronicasGrupalesByGrupo(cveGrupo: number) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbygrupo/${cveGrupo}`);
  }

  getCronicasGrupalesByUbicacion(cveUbicacion: string) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbyubicacion/${cveUbicacion}`);
  }

  getCronicasGrupalesByFecha(fecha: string | null) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbyfecha/${fecha}`);
  }

  getCronicasGrupalesByEspecialidadEspecifica(especialidadEspecifica: string) {
    return this.http.get<any>(`${environment.msmtsCronicas}/cronicasbyespecif/${especialidadEspecifica}`);
  }

  getCronicasGrupalesByFiltros(cveServicio: string, cveTurno: number, cveGrupo: number, cveUbicacion: string, fecha: string | null, especialidadEspecifica: string) {
    return this.http.get<any>(`${environment.msmtsCronicas}/filtrocronicas/${cveServicio}/${cveTurno}/${cveGrupo}/${cveUbicacion}/${fecha}/${especialidadEspecifica}`);
  }

  addCronica(cronica: Cronica) {
    return this.http.post(`${environment.msmtsCronicas}/guardanueva/`, cronica);
  }

  updateCronica(cronica: Cronica) {
    return this.http.post(`${environment.msmtsCronicas}/actualizacronica/`, cronica);
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${environment.msmtsCronicas}/reporteCronica`, JSON.stringify(data), {responseType : 'blob'});
  }

}
