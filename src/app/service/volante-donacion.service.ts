import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VolanteDonacion } from '../models/volante-donacion.model';

//configuración de url modificar cuando haya endpoint
const urlServVolantes = `${environment.urlServVolantes}/api`

@Injectable({
  providedIn: 'root'
})

export class VolanteDonacionService {

  constructor(
    private http: HttpClient
  ) { }

  getVolantesByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<VolanteDonacion[]>(`${urlServVolantes}/findVolantesByFechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }

  addVolante(controlArticulos: VolanteDonacion) {
    return this.http.post<VolanteDonacion>(`${urlServVolantes}/guardaNuevoVolanteDonacionSangre`, controlArticulos);
  }

}
