import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as XLSX from 'xlsx';



@Directive({
  selector: '[appReadexcel]',
  exportAs: 'readexcel',
})
export class ReadexcelDirective {
  excelObservable!: Observable<any>;
  @Output() eventEmitter = new EventEmitter();
  @Input()
  sheetName!: string;

  constructor() {}

  @HostListener('change', ['$event.target'])
  onChange(target: HTMLInputElement) {
    const file = target.files[0];

    this.excelObservable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    this.excelObservable.subscribe((d) => {
      this.eventEmitter.emit(d);
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      
      const bufferArray = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bufferArray, { type: 'buffer' });
      console.log('sheetName '+this.sheetName);
      
    //  const wsname: string = wb.SheetNames[this.sheetName];
    

      const ws: XLSX.WorkSheet = wb.Sheets[this.sheetName];
      

      const data = XLSX.utils.sheet_to_json(ws,{
       
        //dateNF: "dd/mm/yyyy"
        dateNF:'D-M-YYYY'
        //raw:false,
        //dateNF:"DD/MM/YYYY"
      }
        
        );

      subscriber.next(data);
      subscriber.complete();
    };
  }
}
