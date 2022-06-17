import { LongDateFormatKey } from "moment";
import { Horario } from "./horario.model";

export class HorarioResponse {
	
  	 public  code:number;
	 public message:string;	 
     public data: Horario[];
}