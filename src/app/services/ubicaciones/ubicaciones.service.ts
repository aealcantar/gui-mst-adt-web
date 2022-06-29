import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private serverEndPointURLUbicaciones = `${environment.urlMSEDSCHorarios}/ubicacion`;
  constructor(private http: HttpClient) { }


 getAll(){


  return this.http.get(this.serverEndPointURLUbicaciones + '/getAll');
}

  
getByDescAbv(descAbv:string){

  return this.http.get(this.serverEndPointURLUbicaciones + `/search/${descAbv}/`);
}

getHorariosByIdUbicacion(cveUbicacion:number,dia:string){

  return this.http.get(this.serverEndPointURLUbicaciones + `/getById/${cveUbicacion}/${dia}/`);
}

}
