import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cat_Ubicacion, Ubicacion } from 'src/app/models/ubicacion-model';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private serverEndPointURLUbicaciones = `${environment.urlMSEDSCHorarios}/ubicacion`;
  private serverEndPointURLCat = `${environment.urlMSEDSCHorarios}/api`;
  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get(this.serverEndPointURLUbicaciones + '/getAll');
  }





  getAllByIdUSer(idUser: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.serverEndPointURLCat + `/getAllUbicacion/${idUser}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8')
    });
  }



  getByDescAbv(descAbv: string) {

    return this.http.get(this.serverEndPointURLUbicaciones + `/search/${descAbv}/`);
  }

  getByDescAbvbyUser(descripcionCorta: string, idUser: number) : Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.serverEndPointURLUbicaciones + `/search/${descripcionCorta}/${idUser}`,{
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json; charset=utf-8')
    });
  }

  getHorariosByIdUbicacion(cveUbicacion: number, dia: string) {

    return this.http.get(this.serverEndPointURLUbicaciones + `/getById/${cveUbicacion}/${dia}/`);
  }

}
