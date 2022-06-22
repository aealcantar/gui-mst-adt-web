import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Estado } from '../models/estado.model';
import { Municipio } from '../models/municipio.model';
import { Ciudad } from '../models/ciudad.model';
import { EstudioMedico } from '../models/estudio-medico.model';
import { Observable } from 'rxjs';
import { EstadoCivil } from '../models/estado-civil.model';
import { Ocupacion } from '../models/ocupacion.model';

@Injectable({
  providedIn: 'root'
})
export class EstudioSocialMedicoService {

  constructor(
    private http: HttpClient
  ) { }

  getCatEstados() {
    return this.http.get<Estado[]>(`${environment.urlServCatalogos}/api/listEstados`);
  }

  getCatMunicipiosByEstado(idEstado: number) {
    return this.http.get<Municipio[]>(`${environment.urlServCatalogos}/api/getDelegacionMunicipio/${idEstado}`);
  }

  getCiudadByEstadoMunicipio(idEstado: number, idDelegacionMunicipio: number) {
    return this.http.get<Ciudad[]>(`${environment.urlServCatalogos}/api/getCiudades/${idEstado}/${idDelegacionMunicipio}`);
  }

  getCatEstadosCiviles() {
    return this.http.get<EstadoCivil[]>(`${environment.urlServEstudioMedicos}/getEstadosCiviles`);
  }

  getCatOcupacionById(idOcupacion: number) {
    return this.http.get<Ocupacion>(`${environment.urlServCatalogos}/api/getOcupacionByID/${idOcupacion}`);
  }

  getCatOcupaciones() {
    return this.http.get<Ocupacion[]>(`${environment.urlServCatalogos}/api/lisOcupaciones`);
  }

  getCatTiposComunidad() {
    return this.http.get<EstadoCivil[]>(`${environment.urlServEstudioMedicos}/getTiposComunidad`);
  }

  getEstudiosMedicosByFechas(fechaInicio: string, fechaFin: string) {
    return this.http.get<EstudioMedico[]>(`${environment.urlServEstudioMedicos}/findEstudiosMedByRangoFechas/${fechaInicio}/${fechaFin}`);
  }

  addEstudioSocial(estudioMedicoSocial: EstudioMedico){
    return this.http.post<EstudioMedico>(`${environment.urlServEstudioMedicos}/guardaNuevoEstudioMed`, estudioMedicoSocial);
  }

  downloadPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType: 'blob' });
    return this.http.post<Blob>(`${environment.urlServEstudioMedicos}/reporteEstudiosMedicos`, JSON.stringify(data),
    { headers: headers, responseType: 'blob' as 'json'});
  }

}