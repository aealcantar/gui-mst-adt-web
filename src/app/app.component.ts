import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './service/auth-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'busquedaNss';
  descripcion = 'este es un titulo de prueba';
  public userLogged: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) {}

  ngOnInit() {
   this.authService.userLogged$.asObservable().subscribe(
     (response) => this.userLogged = response 
   );
  }

  onActivate() {
    window.scroll(0,0);
 }

}
declare let $: any;