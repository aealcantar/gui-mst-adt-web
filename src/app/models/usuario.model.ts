export class Usuario {
    public idUsuario?: number | undefined;
    public strEmail?: string = "";
    public strUserName?: string = "";
    public strPassword?: string = "";
    public strRol?: string = "";
    public strNombres?: string = "";
    public strApellidoP?: string = "";
    public strApellidoM?: string = "";
    public cveUsuario?: number;
    public rolUser?: number;
    public matricula?: string = "";
    public puesto?: string = "";
    public unidadMedica?: string = "";
    public cedulaProfesional?: string = "";
    public nameRolUser?: string = "";
    public areaDefault?: string = "";
    constructor() { }
}