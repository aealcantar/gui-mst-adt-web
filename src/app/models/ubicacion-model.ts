export class Ubicacion {
public cveUbicacion:string;
	
public descripcionCompleta:string;
public descripcionAbreviada:string;
public tipo:string;
public nivelAtencion:string;
public servicioEspecialidad:string;
public unidadMedica:string;
public des_especialidad: string;
}



export class Cat_Ubicacion {
    public cve_ubicacion:string;
        
    public des_completa_ubicacion:string;
    public des_abreviada_ubicacion:string;
    public cve_tipo_unidad_medica:string;
    public cve_nivel:string;
    public cve_especialidad:string;
    public des_especialidad:string;
    public cve_unidad_medica:string;
    public tipoUbicacionEntity: TipoUbicacion;
    public lstHorarioEntity:[];
    }


    export class TipoUbicacion {
        public cveTipoUbicacion:string;
            
        public desUbicacion:string;
        
       
        }