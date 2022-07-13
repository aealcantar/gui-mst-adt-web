import { EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-menuhorarios',
  templateUrl: './menuhorarios.component.html',
  styleUrls: ['./menuhorarios.component.css']
})
export class MenuhorariosComponent implements OnInit,OnChanges  {
  //domingo 0 lunes 1
  public diasSemana:Array <boolean>= [false,false,false,false,false,false,false];
  public diasSemanaInhabil:Array <boolean>= [false,false,false,false,false,false,false];
  public dia:number;
  @Output() messageEvent = new EventEmitter<number>();
  @Input() diainhabil: LooseObject = {dia: 0, inhabil: true};

  constructor() { }

  ngOnInit(): void {

    this.dia = (new Date()).getDay();
    this.diasSemana[this.dia]=true;

    //TEMPORAL -- CAMBIAR CUANDO SE TENGA EL DIA QUE SE DESEA INHABILITAR
    //this.diasSemanaInhabil[this.diainhabil['dia']]=this.diainhabil['inhabil'];

  }



  clickDay(diaClicked:number){
    for (let index = 0; index < this.diasSemana.length; index++) {
        this.diasSemana[index]=false;
    }
    this.diasSemana[diaClicked]=true;
    this.messageEvent.emit(diaClicked);

  }

  ngOnChanges(changes: SimpleChanges) {
    
    for (let property in changes) {
      if (property === 'diainhabil') {
        console.log('Current:', changes[property].currentValue);
        this.diasSemanaInhabil[changes[property].currentValue['dia']-1]=changes[property].currentValue['inhabil'];
      }
    }
  }

}
