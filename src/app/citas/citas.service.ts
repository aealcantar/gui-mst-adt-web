import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  //baseApiUrl = "http://localhost:8080/api/";
  baseApiUrl = environment.urlMSEDSCatalogos;
  baseApiUrl2 = environment.urlMSADTCITAS;

  // header = new HttpHeaders()
	// 		.set('Content-Type', 'aplication/json')
  //     .set('Access-Control-Allow-Origin', '*');

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer szdp79a2kz4wh4frjzuqu4sz6qeth8m3',
  });

  constructor(private http:HttpClient) { }

  getlistservicios(unidadmedica: string):Observable<any>{
    let direccion = this.baseApiUrl + '/listserviciosUm/' + unidadmedica;

    return this.http.get(direccion,{headers: this.header});
  }

  getlistturnos():Observable<any>{
    let direccion = this.baseApiUrl + '/listTurnos';

    return this.http.get(direccion,{headers: this.header});
  }

  getlistprogramas(cve_especialidad: number):Observable<any>{
    let direccion = this.baseApiUrl + '/listPrograma/' + cve_especialidad;

    return this.http.get(direccion,{headers: this.header});
  }

  getlistlugares(cve_especialidad: number):Observable<any>{
    let direccion = this.baseApiUrl + '/listUbicacion/' + cve_especialidad;

    return this.http.get(direccion,{headers: this.header});
  }

  getlistresponsables(cve_ubicacion: number, cve_turno: number):Observable<any>{
    let direccion = this.baseApiUrl + '/listResponsables/' + cve_ubicacion + '/' + cve_turno;

    return this.http.get(direccion,{headers: this.header});
  }

  buscacitas(data: object):Observable<any>{
    let direccion = this.baseApiUrl2 + '/buscarCitas';

    return this.http.post(direccion, data, {headers: this.header});
  }

  consultacita(id: number):Observable<any>{
    let direccion = this.baseApiUrl2 + '/consultarCita/' + id;

    return this.http.get(direccion,{headers: this.header});
  }

  getfechascalanual(cve_especialidad: number, cve_gpo: number):Observable<any>{
    let direccion = this.baseApiUrl + '/listCalendarioAnualFecha/' + cve_especialidad + '/' + cve_gpo;

    return this.http.get(direccion,{headers: this.header});
  }

  gethorarioscalanual(cve_especialidad: number, cve_gpo: number, fecha: string):Observable<any>{
    let direccion = this.baseApiUrl + '/listCalendarioAnualHorarios/' + cve_especialidad + '/' + cve_gpo + '/' + fecha;

    return this.http.get(direccion,{headers: this.header});
  }

  cancelarcita(id: number):Observable<any>{
    let direccion = this.baseApiUrl2 + '/cancelarCita/' + id;
    return this.http.put(direccion,{headers: this.header});
  }

  cancelarcitacal(id: number):Observable<any>{
    let direccion = this.baseApiUrl + '/CancelarCita/' + id;
    return this.http.get(direccion,{headers: this.header});
  }

  getcomplementocita(cve_especialidad: string, cve_gpo: number):Observable<any>{
    let direccion = this.baseApiUrl + '/Complemento/' + cve_especialidad + '/' + cve_gpo;
    return this.http.get(direccion,{headers: this.header});
  }

  altacita(id: number):Observable<any>{
    let direccion = this.baseApiUrl + '/AltaCita/' + id;
    return this.http.get(direccion,{headers: this.header});
  }

  guardacita(data: object):Observable<any>{
    let direccion = this.baseApiUrl2 + '/agendarCita';
    return this.http.post(direccion, data, {headers: this.header});
  }

  getlistparticipantes(nss: String):Observable<any>{
    let direccion = environment.msmtsPacientes + nss;

    return this.http.get<any>(direccion);
  }

  confirmarasistencia(id: number):Observable<any>{
    let direccion = this.baseApiUrl2 + '/confirmarCita/' + id;
    return this.http.put(direccion,{headers: this.header});
  }

  obtinerutaimpresioncita(id: number, iduser: number){
    let ruta = this.baseApiUrl2 + '/download/PDF/cita/' + id + '/genera/' + iduser;
    return ruta;
  }


}
