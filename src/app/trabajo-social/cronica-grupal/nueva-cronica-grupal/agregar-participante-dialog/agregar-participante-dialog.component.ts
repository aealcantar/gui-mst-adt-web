import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from 'src/app/models/paciente.model';
import { Participante } from 'src/app/models/participante.model';
import { ServiceService } from 'src/app/busqueda-nss/busqueda-nss.service';

declare var $: any;
declare var $gmx: any;

@Component({
    selector: 'agregar-participante-dialog',
    templateUrl: './agregar-participante-dialog.component.html',
    styleUrls: ['./agregar-participante-dialog.component.css']
})

export class AgregarParticipanteDialogComponent implements OnInit {
    public descripcion: string = "";
    public descNotData: string = "Sin información disponible" || "Sin resultados para mostrar";
    public listPacientes: Paciente[] = [];
    public listParticipantes: Participante[] = [];
    public countChecked: number = 0;
    public nombre: string = "";

    public numitems: number = 3;
    public pagactual: number = 1;
    public dtOptions: DataTables.Settings = {};

    public alertMensaje: string = "";
    public alertVisible: boolean = false;
    public alertTipo: string = "";
    public errorBusqueda: boolean = false;

    public editForm: FormGroup = this.fb.group({
        nssPaciente: [null,
            Validators.compose([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10)]
            )],
    })

    public otrosForm: FormGroup = this.fb.group({
        nombres: this.fb.array([]),
    });

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AgregarParticipanteDialogComponent>,
        private serviceService: ServiceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.descripcion = data.descripcion;
    }

    ngOnInit(): void {
        this.dtOptions = {
            pagingType: 'simple_numbers',
            pageLength: this.numitems,
            processing: true,
            info: false,
            searching: false,
            "lengthChange": false,
            "dom": "t<'table-pie' <'#cargalay.col-md-4'><'col-md-4 col-lg-4 text-center'p><'#nopag.col-md-4'>>",
            "language": {
                "paginate": {
                    "first": "First page",
                    "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
                    "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
                    "last": "last"
                }
            }
        };
    }

    limpiarBusqueda(): void {
        this.editForm.reset();
        this.listPacientes = [];
        this.descNotData = "Sin información disponible";
        this.getCountChecked();
    }

    buscarPaciente(): void {
        if (this.editForm.valid) {
            this.serviceService.getAll(this.editForm.get('nssPaciente')?.value).subscribe({
                next: (resp: any) => {
                    this.listPacientes = resp.busquedanss.beneficiarios;

                    if (resp.busquedanss.registrosTotal === 0) {
                        this.descNotData = "Sin resultados para mostrar";
                    } else {
                        this.getCountChecked();
                    }

                }, error: (err) => {
                    this.muestraAlerta('<strong>Error de red.</strong> No fue posible conectar con la API de busqueda',
                        'alert-danger', null
                    );
                    console.log(err);
                    this.errorBusqueda = true;
                    this.descNotData = "Sin resultados para mostrar";
                    // this.listPacientes = [
                    //     {
                    //         nss: 4382641109,
                    //         paciente: 'Jaime Daniel Villalobos Barrios',
                    //         parentesco: 'Titular',
                    //         agregadoMedico: '24567890567',
                    //         unidadMedica: 'UMF #40',
                    //     },
                    //     {
                    //         nss: 7648043776,
                    //         paciente: 'Daniela García Rodríguez',
                    //         parentesco: 'Esposa',
                    //         agregadoMedico: '25567890567',
                    //         unidadMedica: 'UMF #40',
                    //     },
                    //     {
                    //         nss: 4052890017,
                    //         paciente: 'Jaime Daniel Villalobos García',
                    //         parentesco: 'Hijo',
                    //         agregadoMedico: '26567890567',
                    //         unidadMedica: 'UMF #40',
                    //     }
                    // ]
                }
            });
        } else {
            this.muestraAlerta('<strong>Error.</strong>¡La longitud del NSS no es correcta, favor de verificar!',
                'alert-danger', null
            );
        }
    }

    cancelar(): void {
        this.dialogRef.close(false);
    }

    guardarParticipantes() {
        if (this.countChecked > 0 || this.otros.length > 0) {
            const pacientes = this.listPacientes.filter((item: Paciente) => item.checked === true);
            pacientes.map((item: Paciente) => {
                this.listParticipantes.push({
                    nombreParticipante: item.paciente,
                    numNssParticipante: item.nss,
                    indAsistencia: false,
                });
            });

            for (let i = 0; i < this.otros.length; i += 1) {
                this.listParticipantes.push({
                    nombreParticipante: this.otros.at(i).get('nombreCompleto')?.value,
                    numNssParticipante: null,
                    indAsistencia: false,
                });
            }
            this.dialogRef.close(this.listParticipantes);
        }
    }

    changeAll(evt: any) {
        const { checked: val } = evt.target;
        this.listPacientes.map((item) => item.checked = val);
        this.getCountChecked();
    }

    changeChecked(evt: any, item: Paciente) {
        const { checked } = evt.target;
        item.checked = checked;
        this.getCountChecked();
    }

    getCountChecked() {
        this.countChecked = this.listPacientes.filter(o => o.checked === true).length;
    }

    newOtro(): FormGroup {
        return this.fb.group({
            nombreCompleto: this.nombre,
        });
    }

    addOtro() {
        if (this.nombre !== "") {
            this.otros.push(this.newOtro());
            this.nombre = "";
        }
    }

    removeOtro(i: number) {
        this.otros.removeAt(i);
    }

    get otros(): FormArray {
        return this.otrosForm.get("nombres") as FormArray
    }

    muestraAlerta(mensaje: string, estilo: string, funxion: any) {

        this.alertMensaje = mensaje;
        this.alertTipo = estilo;
        this.alertVisible = true;

        setTimeout(() => {
            this.alertMensaje = mensaje;
            this.alertTipo = estilo;
            this.alertVisible = false;

            if (funxion != null) {
                funxion();
            }
        }, 5000);
    }
}