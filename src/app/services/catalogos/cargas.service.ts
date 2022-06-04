import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { CargasCatalogos } from 'src/app/models/catalogos.model';

import { catchError, map } from 'rxjs/operators';
import { ServicioRequest } from 'src/app/models/servicio-request-model';

import { CalendarioRequest } from 'src/app/models/calendario-request-model';
import { ProgramaTSRequest } from 'src/app/models/programa-ts-request-model';
import { UbicacionRequest } from 'src/app/models/ubicacion-request-model';



import { ResponsableRequest } from 'src/app/models/responsable-request-model';




import { CargasResponse } from 'src/app/models/carga-response-model';
import { DownloadFile } from 'src/app/models/downloadFile-model';
import { UnidadMedicaRequest } from 'src/app/models/unidad-medica-request.model';
import { PuestoRequest } from 'src/app/models/puesto-request-model';
import { TurnoRequest } from 'src/app/models/turno-request-model';
import { PersonaRequest } from 'src/app/models/persona-request-model';


@Injectable({
    providedIn: 'root'
})

export class CargasService {
    private serverEndPointURLCatalogos = `${environment.urlMSADCargasCatalogos}`+`/catalogos`;
    private serverEndPointURLFile= `${environment.urlMSADCargasCatalogos}`+`/file`;
    private baseApiUrl = "https://file.io"

    constructor(private http: HttpClient) { }



    getEstatusCargaInicial(): Observable<CargasCatalogos> {
        return this.http.get<CargasCatalogos>(this.serverEndPointURLCatalogos + `/estatusCargaInicial/`, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json; charset=utf-8')
        }).pipe(
            catchError(this.handleError),
            map((response: CargasCatalogos) => {

                return response;
            })
        );
    }

    upload(file: File): Observable<HttpEvent<any>> {

        // Create form data
        const formData = new FormData();

        // Store form name as "file" with file data
        formData.append("file", file, file.name);

        // Make http post request over api
        // with formData as req
        return this.http.post(this.baseApiUrl, formData, { reportProgress: true, observe: 'events' })
    }




    agregarServicios(request: ServicioRequest):Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}` + `/servicio/agregarServicios/`, request, { observe: 'response' });
 
     }
    agregarProgramasTs(request: ProgramaTSRequest) :Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}/programas/agregarProgramasSociales/`, request , { observe: 'response' });

    }

    agregarCalendarioDias(request: CalendarioRequest) :Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}/calendario/agregarDiasCalendarioAnual/`, request, { observe: 'response' });

    }

 

    agregarUbicaciones(request: UbicacionRequest):Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}` + `/ubicacion/agregarUbicaciones/`, request, { observe: 'response' });
 
     }

     agregarResponsable(request: ResponsableRequest):Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}` + `/responsable/agregarResponsables/`, request, { observe: 'response' });
 
     }


 

    agregarUnidadesMedicas(unidadMedica: UnidadMedicaRequest):Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}` + `/unidadmedica/agregarUnidadMedica/`, unidadMedica, { observe: 'response' });
 
     }
    agregarPersona(request: PersonaRequest) :Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}/personas/agregarPersonas/`, request, { observe: 'response' });
 
     }

   

    
     agregarTurnos(request: TurnoRequest) :Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}/turno/agregarTurnos/`, request, { observe: 'response' });
     }

     agregarPuestos(request: PuestoRequest) :Observable<HttpResponse<CargasResponse>> {
        return this.http.post<any>(`${this.serverEndPointURLCatalogos}/puestos/agregarPuestos/`, request, { observe: 'response' });
 
     }





    downloadFile(nombreArchivo: DownloadFile): Observable<any> {
        
        return this.http.get<any>(this.serverEndPointURLFile + `/downloadFile?nombreArchivo=${nombreArchivo.nombreArchivo}`, {
             
        }).pipe(
            catchError(this.handleError),
            map((response: any) => {

                return response;
            })
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.log("Error", error.status);
        // Return an observable with a user-facing error message.
        return throwError(error);
    }


}


/*

   
   






    downloadFile(nombreArchivo: DownloadFile): Observable<any> {
        
        return this.http.get<any>(this.serverEndPointURLFile + `/downloadFile?nombreArchivo=${nombreArchivo.nombreArchivo}`, {
             
        }).pipe(
            catchError(this.handleError),
            map((response: any) => {

                return response;
            })
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.log("Error", error.status);
        // Return an observable with a user-facing error message.
        return throwError(error);
    }


}
*/