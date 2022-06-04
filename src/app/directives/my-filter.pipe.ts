import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPartipts'
})
export class MyFilterPipe  implements PipeTransform {

  transform(values: any[], field:string): any[] {
    if(!values || !field){
      return values;
    }

    return values.filter(v => v[field] === true);
  }

}
