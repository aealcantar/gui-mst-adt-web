import { Injectable } from '@angular/core'
import { BnNgIdleService } from 'bn-ng-idle'
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ModalSesionComponent } from './modal-sesion/modal-sesion.component'
import { Router } from '@angular/router'
import { ModalSesionService } from './modal-sesion/modal-sesion.service'
import { AuthService } from './service/auth-service.service'
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'

@Injectable()
export class JRInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith('carga-masiva')) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })
    } else {
      if (
        request.url.endsWith('app?appName=SAD') ||
        request.url.endsWith('publico/authenticate') ||
        request.url.includes('recuperarPassword') ||
        request.url.includes('actualizarPassword')
      ) {
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        })
      }
    }

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          // console.log("###### Interceptor HttpResponse execute . . .")
        }
        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            console.error(
              'Ha ocurrido un error inesperado: ' + err.error.message,
            )
          } else if (err instanceof HttpErrorResponse) {
            // this.mostrarErrorDeServidor(err);
          } else {
            console.error('Ha ocurrido un error inesperado: ' + err)
          }
          return throwError(err)
        })
      }),
    )
  }


  private mostrarErrorDeServidor(error: HttpErrorResponse): void {
    switch (error.status) {
        case 401:
            console.error(`Acceso no autorizado: ${error.message}`);
            this.cerrarSesion();
            break;

        case 403:
            console.error(`Acceso no autorizado: ${error.message}`);
            this.cerrarSesion();
            break;

        case 404:
            console.error(`Recurso no encontrado: ${error.message}`);
            break;

        case 500:
            console.error(`Error interno del servidor: ${error.message}`)
            break;

        default:
            console.error(`Error desconocido del servidor: ${error.message}`);
            break;
    }
}

cerrarSesion(){
  this.authService.logout();
}

}
