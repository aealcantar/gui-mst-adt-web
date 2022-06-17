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

  getArticulos() {
    return this.http.get<any>(`${urlServArticulo}/`);
  }

  getArticulosByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<any>(`${urlServArticulo}/rango/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }

  addArticulo(controlArticulos: ControlArticulos) {
    return this.http.post<ControlArticulos>(`${urlServArticulo}/insert`, controlArticulos);
  }

  getArticuloById(id: number){
    return this.http.get<any>(`${urlServArticulo}/folio/${id}`, { responseType: 'json'});
  }

}
