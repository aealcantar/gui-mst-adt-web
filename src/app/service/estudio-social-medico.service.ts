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
    return this.http.get<Estado[]>(`${environment.msmtsCatalogos}/api/listEstados`);
  }

  getCatMunicipiosByEstado(idEstado: number) {
    return this.http.get<Municipio[]>(`${environment.msmtsCatalogos}/api/getDelegacionMunicipio/${idEstado}`);
  }

  getCiudadByEstadoMunicipio(idEstado: number, idDelegacionMunicipio: number) {
    return this.http.get<Ciudad[]>(`${environment.msmtsCatalogos}/api/getCiudades/${idEstado}/${idDelegacionMunicipio}`);
  }

  getCatEstadosCiviles() {
    return this.http.get<EstadoCivil[]>(`${environment.msmtsEstudioMedicos}/getEstadosCiviles`);
  }

  getCatOcupacionById(idOcupacion: number) {
    return this.http.get<Ocupacion>(`${environment.msmtsCatalogos}/api/getOcupacionByID/${idOcupacion}`);
  }

  getCatOcupaciones() {
    return this.http.get<Ocupacion[]>(`${environment.msmtsCatalogos}/api/lisOcupaciones`);
  }

  getCatTiposComunidad() {
    return this.http.get<EstadoCivil[]>(`${environment.msmtsEstudioMedicos}/getTiposComunidad`);
  }

  getEstudiosMedicosByFechas(fechaInicio: string, fechaFin: string) {
    return this.http.get<EstudioMedico[]>(`${environment.msmtsEstudioMedicos}/findEstudiosMedByRangoFechas/${fechaInicio}/${fechaFin}`);
  }

  addEstudioSocial(estudioMedicoSocial: EstudioMedico){
    return this.http.post<EstudioMedico>(`${environment.msmtsEstudioMedicos}/guardaNuevoEstudioMed`, estudioMedicoSocial);
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<any>(`${environment.msmtsEstudioMedicos}/reporteEstudiosMedicos`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
  }

}
