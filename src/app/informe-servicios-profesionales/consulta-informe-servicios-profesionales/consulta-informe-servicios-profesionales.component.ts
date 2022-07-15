// TODO: Eliminar datos prueba
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

    // catalogos
    grupos: any[] = [];
    lugares: any[] = [];
    responsables: any[] = [];
    serviciosEspecialidad: any[] = [];
    turnos: any[] = [];
    // tabla
    dtOptions: DataTables.Settings = {};
    // paginado
    page: number = 1;
    pageSize: number = 15;
    // datos
    datosBusqueda: Array<any> = [];

    order: string = 'desc';
    columnaId: string = 'fecha';

    // Formulario
    formularioBusqueda = new FormGroup({
        lugar: new FormControl('', Validators.required),
        responsable: new FormControl('', Validators.required),
        servicio: new FormControl('', Validators.required),
        turno: new FormControl('', Validators.required),
    })

    // Datos prueba
    public datosPrueba =  [
        { 
        "numero": "12345",
        "paciente": "Miguel Sanchez",
        "horaCita": "10:00:00",
        "agregadoMedico": "Nataly",
        "primeraVez": "true",
        "citado": "11",
        },
        { 
        "numero": "67890",
        "paciente": "Angel Hernandez",
        "horaCita": "10:00:00",
        "agregadoMedico": "Nataly",
        "primeraVez": "true",
        "citado": "12",
        }
    ];

    constructor() { }

    ngOnInit() {
        this.dtOptions = {
            order: [[2, 'desc']],
            ordering: false,
            paging: false,
            processing: false,
            info: false,
            searching: false,
        };
        this.datosBusqueda = this.datosPrueba
    }

    limpiar(): void {
        this.formularioBusqueda.reset();
    }

    buscar(): void {
        console.log('Submit works')
    }

    sortBy(columnaId: string, order: string, type: string): void {
    }

    irDetalle(informeServicios: any): void {

    }
}
