import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cronica } from 'src/app/models/cronica.model';
import { MatDialog } from '@angular/material/dialog';
import { AgregarParticipanteDialogComponent } from '../../nueva-cronica/agregar-participante-dialog/agregar-participante-dialog.component';
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { Participante } from 'src/app/models/participante.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
const NUM_PARTICIPANTES: number = 0;

@Component({
  selector: 'app-nueva-cronica-desde-cero',
  templateUrl: './nueva-cronica-desde-cero.component.html',
  styleUrls: ['./nueva-cronica-desde-cero.component.css'],
})
export class NuevaCronicaDesdeCeroComponent implements OnInit, AfterViewInit {
  readonly ID_SERVICIO_TRABAJO_SOCIAL = "15";
  public listParticipantes: Participante[] = [];
  public cronica!: Cronica;
  public editForm!: FormGroup;
  public grupos: any[] = [];
  public serviciosEspecialidad: any[] = [];
  lugares: any[] = [];
  lugaresObserver = {
    next: (lugares: any) => this.lugares = lugares,
    error: (error: HttpErrorResponse) => console.log(error),
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cronicaGrupalService: CronicaGrupalService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cronicaGrupalService.getCatLugarSolo().subscribe(this.lugaresObserver);
  }

  ngAfterViewInit(): void {
    $('#fecha-cronica-cero').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fecha'].setValue(date);
        }
      }
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      servicio: [null, Validators.required],
      grupo: [null, Validators.required],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
      descPonentes: [null, Validators.required],
      numTotalParticipantes: [null, Validators.required],
      // numParticipantesAsistieron: [null, Validators.required],
      desTecnicaDidactica: [null, Validators.required],
      desMaterialApoyo: [null, Validators.required],
      desModalidad: ['Presencial', Validators.required],
      desOcasionServicio: ['Inicial', Validators.required],
      desObjetivosSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desDesarrolloSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desPerfilGrupo: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desObservaciones: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desUbicacion: [null, Validators.required],
    });

    this.obtenerServicios();
    this.getNumParticipantes();
  }

  obtenerServicios() {
    this.cronicaGrupalService.getCatServicios().toPromise().then(
      (servicios) => {
        this.serviciosEspecialidad = servicios;
        const especialidad =
          this.serviciosEspecialidad.find((item: any) => this.ID_SERVICIO_TRABAJO_SOCIAL === item.cve_especialidad);
        if (especialidad && especialidad.cve_especialidad) {
          this.editForm.get('servicio').setValue(especialidad.cve_especialidad);
          this.obtenerGrupoPorServicio();
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  obtenerGrupoPorServicio() {
    this.cronicaGrupalService.getCatGrupo(this.editForm.get('servicio').value).toPromise().then(
      (grupos) => {
        this.grupos = grupos;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  getNumParticipantes() {
    // TO DO Implementar servicio para obtener Numero de Participantes
    // this.cronicaGrupalService.getNumParticipantes(idCita).subscribe((resp: any) => {
    //     if (resp) {
    //       this.editForm.get('numParticipantesAsistieron')?.patchValue(resp.numParticipantes || 0);
    //     }
    //   },
    //   (httpErrorResponse: HttpErrorResponse) => {
    //     console.error(httpErrorResponse);
    //   }
    // );
    this.editForm.get('numTotalParticipantes')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
  }

  addParticipanteDialog() {
    const dialogRef = this.dialog.open(AgregarParticipanteDialogComponent, {
      width: '1170px',
      height: 'auto',
      maxWidth: '1170px',
      position: { top: `100px` },
      panelClass: 'dialog-styles',
      data: '',
    });

    dialogRef.afterClosed().subscribe((participantes: Participante[]) => {
      if (participantes && participantes.length > 0) {
        this.listParticipantes = participantes;
        this.editForm.get('numTotalParticipantes')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
      }
    });
  }

  modalcarga(content: any) {
    //this.modalService.open(content, {centered: true,size: 'lg', backdrop: 'static', keyboard: false})
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelarModal() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/consulta-cronica-grupal");
    $('#content').modal('hide');
  }

  getNombreServicio(cveServicio: number | string) {
    return this.serviciosEspecialidad.find(g => g.cve_especialidad === cveServicio)?.des_especialidad;
  }

  getNombreGrupo(cveGrupo: number | string) {
    let idGrupoConverted: number;
    if (typeof cveGrupo === 'string') {
      idGrupoConverted = Number(cveGrupo);
    } else if (typeof cveGrupo === 'number') {
      idGrupoConverted = cveGrupo;
    }
    return this.grupos.find(g => g.cve_grupo_programa === cveGrupo)?.des_grupo_programa;
  }

  guardarCronica() {
    this.cronica = {
      id: null,
      idCalendarioAnual: null,
      idEspecialidad: this.editForm.get('servicio').value,
      desEspecialidad: this.getNombreServicio(this.editForm.get('servicio').value),
      idTurno: 1,
      desTurno: null,
      idGrupo: this.editForm.get('grupo')!.value,
      desGrupo: this.getNombreGrupo(this.editForm.get('grupo')!.value),
      idUbicacion: '9',
      desUbicacion: this.editForm.get('desUbicacion')!.value,
      fecFechaCorta: this.editForm.get('fecha')!.value,
      fecFechaCompleta: null,
      timHora: this.editForm.get('hora')!.value,
      desModalidad: this.editForm.get('desModalidad')!.value,
      desOcasionServicio: this.editForm.get('desOcasionServicio')!.value,
      numTotalParticipantes: this.editForm.get('numTotalParticipantes')!.value,
      // numParticipantesAsistieron: this.editForm.get('numParticipantesAsistieron')!.value,
      idEstatusCronica: 1,
      desEstatusCronica: null,
      descPonentes: this.editForm.get('descPonentes')!.value,
      desTecnicaDidactica: this.editForm.get('desTecnicaDidactica')!.value,
      desMaterialApoyo: this.editForm.get('desMaterialApoyo')!.value,
      desObjetivosSesion: this.editForm.get('desObjetivosSesion')!.value,
      desDesarrolloSesion: this.editForm.get('desDesarrolloSesion')!.value,
      desPerfilGrupo: this.editForm.get('desPerfilGrupo')!.value,
      desObservaciones: this.editForm.get('desObservaciones')!.value,
    }

    console.log(this.cronica);


    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.cronica = {
        ...this.cronica,
        ...this.editForm.value,
        participanteList: this.listParticipantes
      };
      let params = {
        'cronica': JSON.stringify(this.cronica),
      }
      this.cronicaGrupalService.addCronica(this.cronica).subscribe(
        (response: any) => {
        }, (response: HttpErrorResponse) => {
          if (response.statusText === 'OK') {
            this.router.navigate(["detalle-cronica-cero"], { queryParams: params, skipLocationChange: true });
            // this.router.navigateByUrl('/detalle-cronica-cero');
          }
        }
      );
    }
  }

  cancelar() {
    this.router.navigateByUrl("/consulta-cronica-grupal");
  }

}
