import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ControlArticulos } from '../models/control-articulo.model';

//configuración de url modificar cuando haya endpoint
const urlServArticulo = `${environment.urlServArticulos}/api`

@Injectable({
  providedIn: 'root'
})

export class ControlArticuloService {

  constructor(
    private http: HttpClient
  ) { }

  getArticuloById(id: number){
    return this.http.get<any>(`${urlServArticulo}/idCa/${id}`, { responseType: 'json'});
  }

  addArticulo(controlArticulos: ControlArticulos) {
    return this.http.post<ControlArticulos>(`${urlServArticulo}/insert`, controlArticulos);
  }

  getArticulosByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<ControlArticulos[]>(`${urlServArticulo}/rango/fechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }
  
  getArticulos() {
    return this.http.get<ControlArticulos[]>(`${urlServArticulo}/`);
  }




}
