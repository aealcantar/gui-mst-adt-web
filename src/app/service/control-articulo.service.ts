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

<<<<<<< HEAD
=======
  getCatUbicaciones() {
    return this.http.get<any>(`${environment.msmtsCatalogos}/ubicacion/getAll`);
  }

  getArticulosByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<any>(`${urlServArticulo}/findNotasByFechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }

>>>>>>> 9a20813b13bc68bc810f64dc4b5db971dbc24466
  getArticuloById(id: number){
    return this.http.get<any>(`${urlServArticulo}/idCa/${id}`, { responseType: 'json'});
  }

  addArticulo(controlArticulos: ControlArticulos) {
    return this.http.post<ControlArticulos>(`${urlServArticulo}/insert`, controlArticulos);
  }

  getArticulosByFechas(controlArticulos: any) {
    return this.http.post<any>(`${urlServArticulo}/rango/fechas`, controlArticulos);
  }
  
  getArticulos() {
    return this.http.get<ControlArticulos[]>(`${urlServArticulo}/`);
  }




}
