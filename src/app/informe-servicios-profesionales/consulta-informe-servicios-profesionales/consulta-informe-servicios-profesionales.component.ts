import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertInfo } from "src/app/app-alerts/app-alert.interface";

@Component({
    selector: 'app-consulta-informe-servicios-profesionales',
    templateUrl: './consulta-informe-servicios-profesionales.component.html',
    styleUrls: ['./consulta-informe-servicios-profesionales.component.css']
})
export class ConsultaInformeServiciosProfesionalesComponent implements OnInit {

    public alert!: AlertInfo;

    grupos: any[] = [];
    lugares: any[] = [];
    responsables: any[] = [];
    serviciosEspecialidad: any[] = [];
    turnos: any[] = [];

    // Formulario
    formularioBusqueda = new FormGroup({
        lugar: new FormControl('', Validators.required),
        responsable: new FormControl('', Validators.required),
        servicio: new FormControl('', Validators.required),
        turno: new FormControl('', Validators.required),
    })

    constructor() { }

    ngOnInit() { }

    limpiar(): void {
        this.formularioBusqueda.reset();
    }

    buscar(): void {
        console.log('Submit works')
    }
}
