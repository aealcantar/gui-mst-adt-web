import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cronica } from 'src/app/models/cronica.model';
import { MatDialog } from '@angular/material/dialog';
import { AgregarParticipanteDialogComponent } from './agregar-participante-dialog/agregar-participante-dialog.component';
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { Participante } from 'src/app/models/participante.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
const NUM_PARTICIPANTES: number = 5;

@Component({
  selector: 'app-nueva-cronica',
  templateUrl: './nueva-cronica.component.html',
  styleUrls: ['./nueva-cronica.component.css']
})
export class NuevaCronicaComponent implements OnInit, AfterViewInit {
  public listParticipantes: Participante[] = [];
  public cronica!: Cronica;
  public cronicaRecibida: any;
  public editForm!: FormGroup;
  public grupos: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cronicaGrupalService: CronicaGrupalService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let cronicaParse;
    this.route.queryParamMap.subscribe((params: any) => {
      cronicaParse = params.getAll('cronica');
      if (cronicaParse.length > 0) {
        this.cronicaRecibida = JSON.parse(params.getAll('cronica'));
        console.log("OBJETO RECIBIDO: ", this.cronicaRecibida);
        if (this.cronicaRecibida.participanteList.length > 0) {
          this.listParticipantes = this.cronicaRecibida.participanteList;
        }
      } else {
        this.cronicaRecibida = null;
      }
    });
    this.initForm(cronicaParse);
  }

  ngAfterViewInit(): void {
    $('#calendarCronica').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fecha'].setValue(date);
          console.log("date onSelect: ", date);
        }
      }
    });
  }

  initForm(cronicaParse: any): void {
    if (cronicaParse.length > 0) {
      this.editForm = this.fb.group({
        grupo: ["-1"],
        fecha: [null],
        hora: ["-1"],
        descPonentes: [this.cronicaRecibida.descPonentes !== null ? this.cronicaRecibida.descPonentes : null, Validators.required],
        numParticipantesAsistieron: [this.cronicaRecibida.numParticipantesAsistieron !== null ? this.cronicaRecibida.numParticipantesAsistieron : null, Validators.required],
        desTecnicaDidactica: [this.cronicaRecibida.desTecnicaDidactica !== null ? this.cronicaRecibida.desTecnicaDidactica : null, Validators.required],
        desMaterialApoyo: [this.cronicaRecibida.desMaterialApoyo !== null ? this.cronicaRecibida.desMaterialApoyo : null, Validators.required],
        desObjetivosSesion: [this.cronicaRecibida.desObjetivosSesion !== null ? this.cronicaRecibida.desObjetivosSesion : null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desDesarrolloSesion: [this.cronicaRecibida.desDesarrolloSesion !== null ? this.cronicaRecibida.desDesarrolloSesion : null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desPerfilGrupo: [this.cronicaRecibida.desPerfilGrupo !== null ? this.cronicaRecibida.desPerfilGrupo : null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desObservaciones: [this.cronicaRecibida.desObservaciones !== null ? this.cronicaRecibida.desObservaciones : null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      });
    } else {
      this.editForm = this.fb.group({
        grupo: ["-1", Validators.required],
        fecha: [null, Validators.required],
        hora: ["-1", Validators.required],
        descPonentes: [null, Validators.required],
        numParticipantesAsistieron: [null, Validators.required],
        desTecnicaDidactica: [null, Validators.required],
        desMaterialApoyo: [null, Validators.required],
        desObjetivosSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desDesarrolloSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desPerfilGrupo: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
        desObservaciones: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      });
      this.cronicaGrupalService.getCatGrupo('1').toPromise().then(
        (grupos) => {
          this.grupos = grupos;
          console.log("GRUPOS: ", this.grupos);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
    }

    this.getNumParticipantes();
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
    this.editForm.get('numParticipantesAsistieron')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
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
        this.editForm.get('numParticipantesAsistieron')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
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
  
  salirModal(){
    this.router.navigateByUrl("/consulta-notas", { skipLocationChange: true });
    $('#content').modal('hide');
  }

  guardarCronica() {
    if (this.cronicaRecibida !== null) {
      this.cronica = {
        id: this.cronicaRecibida.id,
        idCalendarioAnual: this.cronicaRecibida.idCalendarioAnual,
        idEspecialidad: this.cronicaRecibida.isEspecialidad,
        desEspecialidad: this.cronicaRecibida.desEspecialidad,
        idTurno: this.cronicaRecibida.idTurno,
        desTurno: this.cronicaRecibida.desTurno,
        idGrupo: this.cronicaRecibida.idGrupo,
        desGrupo: this.cronicaRecibida.desGrupo,
        idUbicacion: this.cronicaRecibida.idUbicacion,
        desUbicacion: this.cronicaRecibida.desUbicacion,
        fecFechaCorta: this.cronicaRecibida.fecFechaCorta,
        fecFechaCompleta: this.cronicaRecibida.fecFechaCompleta,
        timHora: this.cronicaRecibida.timHora,
        desModalidad: this.cronicaRecibida.desModalidad,
        numTotalParticipantes: this.cronicaRecibida.numTotalParticipantes,
        numParticipantesAsistieron: this.editForm.get('numParticipantesAsistieron')!.value,
        idEstatusCronica: this.cronicaRecibida.idEstatusCronica,
        desEstatusCronica: this.cronicaRecibida.desEstatusCronica,
        descPonentes: this.editForm.get('descPonentes')!.value,
        desTecnicaDidactica: this.editForm.get('desTecnicaDidactica')!.value,
        desMaterialApoyo: this.editForm.get('desMaterialApoyo')!.value,
        desObjetivosSesion: this.editForm.get('desObjetivosSesion')!.value,
        desDesarrolloSesion: this.editForm.get('desDesarrolloSesion')!.value,
        desPerfilGrupo: this.editForm.get('desPerfilGrupo')!.value,
        desObservaciones: this.editForm.get('desObservaciones')!.value
      }
    } else {
      this.cronica = {
        id: null,
        idCalendarioAnual: null,
        idEspecialidad: 'CS02',
        desEspecialidad: null,
        idTurno: 1,
        desTurno: null,
        idGrupo: parseInt(this.editForm.get('grupo')!.value),
        desGrupo: null,
        idUbicacion: '9',
        desUbicacion: null,
        fecFechaCorta: this.editForm.get('fecha')!.value,
        fecFechaCompleta: null,
        timHora: '10:00:00',
        desModalidad: null,
        numTotalParticipantes: parseInt(this.editForm.get('desObservaciones')!.value),
        numParticipantesAsistieron: null,
        idEstatusCronica: 1,
        desEstatusCronica: null,
        descPonentes: this.editForm.get('descPonentes')!.value,
        desTecnicaDidactica: this.editForm.get('desTecnicaDidactica')!.value,
        desMaterialApoyo: this.editForm.get('desMaterialApoyo')!.value,
        desObjetivosSesion: this.editForm.get('desObjetivosSesion')!.value,
        desDesarrolloSesion: this.editForm.get('desDesarrolloSesion')!.value,
        desPerfilGrupo: this.editForm.get('desPerfilGrupo')!.value,
        desObservaciones: this.editForm.get('desObservaciones')!.value
      }
    }
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.cronica = {
        ...this.cronica,
        ...this.editForm.value,
        participanteList: this.listParticipantes
      };

      console.log("OBJETO: ", this.cronica);
      let params = {
        'cronica': JSON.stringify(this.cronica),
      }
      this.cronicaGrupalService.addCronica(this.cronica).subscribe(
        (response: any) => {
          console.log(response);
        }, (response: HttpErrorResponse) => {
          console.log("RESPUESTA: ", response.statusText);
          if (response.statusText === 'OK') {
            this.router.navigate(["cronicaGuardada"], { queryParams: params, skipLocationChange: true });
          }
        }
      );
    }
  }

  cancelar() {
    this.router.navigateByUrl("/consulta-cronica-grupal", { skipLocationChange: true });
  }

}