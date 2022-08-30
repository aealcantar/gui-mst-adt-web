import { Injectable } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { ModalSesionComponent } from './modal-sesion/modal-sesion.component';
import { Router } from '@angular/router';
import { ModalSesionService } from './modal-sesion/modal-sesion.service';
import { AuthService } from './service/auth-service.service';


@Injectable()
export class JRInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (
      request.url.endsWith("carga-masiva")
    ) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
    } else {
      if (
        request.url.endsWith("app?appName=SAD") ||
        request.url.endsWith("publico/authenticate") ||
        request.url.includes("recuperarPassword") ||
        request.url.includes("actualizarPassword")
      ) {

      } else {
        request = request.clone({
          setHeaders: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });
      }
    }

    return next.handle(request).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          // console.log("###### Interceptor HttpResponse execute . . .")
        }
      })
    );
  }

}
