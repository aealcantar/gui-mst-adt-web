import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ArchivoCarga, ConfiguracionCarga } from 'src/app/models/catalogos.model';






@Injectable({
  providedIn: 'root'
})
export class HelperCatalogosService {



  private lstConfiguracionCat: Array<ConfiguracionCarga> = [
    {
      idCatalogos: 1,
      sheetName: '',
      nombreCatalogo: 'Unidades médicas',
      rutaPlantilla: '../../../../assets/files/7.Unidades.xlsx',
      idCatPadre: undefined,
      col1: 'Región 2021',
      col2: 'CLUES  Salud',
      col3: 'Clave Personal',
      col4: 'Unidad de Información PREI',
      col5: 'Clave Ubicación Admin.',
      col6: 'Clave Presupuestal',
      col7: 'Clave Delegación o UMAE',
      col8: 'Nombre Delegación o UMAE',
      col9: 'Relación Delegación-UMAE',
      col10: 'Unidad Presupuestal',
      col11: 'Nivel de Atención ',
      col12: 'Denominación Unidad',
      col13: 'Tipo de Servicio',
      col14: 'Descripción Tipo Servicio',
      col15: 'Número de Unidad',
      col16: 'Nombre Unidad',
      col17: 'Ubicación o Denominación',
      col18: 'Dirección',
      col19: 'Tipo de Vialidad',
      col20: 'Nombre de Vialidad',
      col21: 'Entre Vialidades',
      col22: 'Número Exterior',
      col23: 'Tipo de Asentamiento',
      col24: 'Nombre del Asentamiento',
      col25: 'Código postal',
      col26: 'Clave Municipio o Delegación ',
      col27: 'Municipio o Delegación ',
      col28: 'Clave Localidad',
      col29: 'Localidad',
      col30: 'Clave Entidad Federativa',
      col31: 'Entidad Federativa',
      col32: 'Clave Jurisdicción Sanitaria',
      col33: 'Jurisdicción Sanitaria',
      col34: 'Latitud',
      col35: 'Longitud',
      col36: 'Inicio de Productividad',
      col37: 'Grado de Marginación',

    },
    {
      idCatalogos: 2,
      nombreCatalogo: 'Servicios',
      rutaPlantilla: '../../../../assets/files/8.ServiciosEspecialidades.xlsx',
      idCatPadre: undefined,
      col1: 'CLAVE ESPECIALIDAD',
      col2: 'DESCRIPCIÓN ESPECIALIDAD',
      col3: 'IND_CE',
      col4: 'IND_HOSP',
      col5: 'IND_IQ',
      col6: 'IND_NIVEL1',
      col7: 'IND_NIVEL2',
      col8: 'IND_NIVEL3',
      col9: 'IND_CSS',
      col10: 'FEC_BAJA',
      col11: 'FEC_ALTA',
      col12: 'FEC_ACTUALIZACION',


    },
    {
      idCatalogos: 3,
      nombreCatalogo: 'Ubicaciones',
      sheetName: 'B_4_UBICACIONES',
      rutaPlantilla: '../../../../assets/files/9.Ubicaciones.xlsx',
      idCatPadre: [1, 2],
      col1: 'CLAVE DE UBICACIÓN',
      col2: 'DESCRIPCION COMPLETA DE UBICACION',
      col3: 'DESCRIPCION ABREVIADA',
      col4: 'TIPO',
      col5: 'NIVEL DE ATENCIÓN',
      col6: 'SERVICIO/ESPECIALIDAD',
      col7: 'UNIDAD MEDICA',

    },
   
   
    
    
    {
      idCatalogos: 4,
      nombreCatalogo: 'Responsables',
      rutaPlantilla: '../../../../assets/files/14.Responsables.xlsx',
      idCatPadre: [3,7,8],
      col1: 'MATRICULA',
      col2: 'NOMBRE',
      col3: 'UBICACIÓN',
      col4: 'TURNO',

    },
    {
      idCatalogos: 5,
      nombreCatalogo: 'Programas de Trabajo Social',
      rutaPlantilla: '../../../../assets/files/10.GruposProgramas O ProgramasTrabajoSocial.xlsx',
      idCatPadre: undefined,
      col1: 'CLAVE GRUPO',
      col2: 'DESCRIPCION GRUPO / PROGRAMA',
      col3: 'CODIGO',
      col4: 'DESCRIPCION ACTIVIDAD',
      col5: 'SERVICIO/ESPECIALIDAD',

    },


    {
      idCatalogos: 6,
      nombreCatalogo: 'Configuración de Calendario Anual',
      rutaPlantilla: '../../../../assets/files/15.CalendarioAnual.xlsx',
      idCatPadre: [2,3],
      col1: 'PROGRAMA',
      col2: 'UBICACIÓN',
      col3: 'FECHA INICIO',
      col4: 'HORA INICIO',
      col5: 'DURACION',
      col6: 'FECHA FIN',
      col7: 'HORA FIN',
      col8: 'MAXIMO DE PARTICIPANTES'


    },

    {
      idCatalogos: 7,
      nombreCatalogo: 'Usuarios',
      rutaPlantilla: '../../../../assets/files/13.Personal.xlsx',
      idCatPadre: [1,8,9],
      col1: 'NOMBRE',
      col2: 'PRIMER_APELLIDO',
      col3: 'SEGUNDO_APELLIDO',
      col4: 'MATRÍCULA',
      col5: 'ROL EN EL SISTEMA',
      col6: 'PUESTO',
      
      col7: 'TURNO',
      col8: 'EMAIL',
      col9: 'ESCUELA_PROCEDENCIA',
     
    },

    {
      idCatalogos: 8,
      nombreCatalogo: 'Turnos',
      rutaPlantilla: '../../../../assets/files/11.Turnos.xlsx',
      idCatPadre: undefined,
      
      col1: 'Descripción de turno',
      col2: '4_30_6',


    },
    {
      idCatalogos: 9,
      nombreCatalogo: 'Puestos',
      rutaPlantilla: '../../../../assets/files/12.Puestos.xlsx',
      idCatPadre: undefined,
      col1: 'DESCRIPCION',


    }
    ,

  ];


   getConfiguracionCat() {
    return this.lstConfiguracionCat;
  }


}
