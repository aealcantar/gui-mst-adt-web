import { LongDateFormatKey } from "moment";
import { Horario } from "./horario.model";

export class HorarioResponse {
	
  	 public  code:number;
	 public estatus: boolean;
	 public mensaje:string;	 
     public data: Horario[];
}