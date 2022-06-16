import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn } from '@angular/forms'

declare var $: any;

@Component({
  selector: 'app-nuevo-vdonacion-sangre',
  templateUrl: './nuevo-vdonacion-sangre.component.html',
  styleUrls: ['./nuevo-vdonacion-sangre.component.css']
})
export class NuevoVdonacionSangreComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  modalcarga() {
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
    this.router.navigateByUrl("/consulta-estudios-medicos", { skipLocationChange: true });
    $('#content').modal('hide');
  }
}
