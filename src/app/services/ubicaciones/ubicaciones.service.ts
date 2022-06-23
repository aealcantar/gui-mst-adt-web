import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private serverEndPointURLUbicaciones = `${environment.urlMSADCargasCatalogos}`;
  constructor(private http: HttpClient) { }


 getAll(){


  return this.http.get(this.serverEndPointURLUbicaciones + '/catalogos/ubicacion/getAll');
}

  
getByDescAbv(descAbv:string){

  return this.http.get(this.serverEndPointURLUbicaciones + `/catalogos/ubicacion/search/${descAbv}/`);
}
}
