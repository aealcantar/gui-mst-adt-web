import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth-service.service";


@Injectable()
export class SeguridadRouter implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login'], { skipLocationChange: true });
      return false;
    }
    return true;
  }
}
