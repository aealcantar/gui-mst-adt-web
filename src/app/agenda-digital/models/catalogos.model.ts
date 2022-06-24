export class CargasCatalogos {
    code: number;
    message: string;
    data: Cargas;

    constructor() { }
}

export class Cargas {
    completos: number;
    pendientes: number;
    errores: number;
    estatusCarga: boolean;
    lstCatalogos: CatalogoData[];

    constructor() { }
}


export class CatalogoData {
    idCatalogos: number;
    nombreCatalogo: string;
    ultimaModificacion: Date;
    estatusCarga: EstatusCarga;
    sheetName: string;

    constructor() { }
}

export class EstatusCarga {
    cveIdEstatus: number;
    cveNombre: string;
    cveClave: string;


    constructor() { }
}


export class ConfiguracionCarga {
    idCatalogos: number;
    nombreCatalogo: string;
    rutaPlantilla: string;
    idCatPadre?: number[];
    col1: string;
    col2?: string;
    col3?: string;
    col4?: string;
    col5?: string;
    col6?: string;
    col7?: string;
    col8?: string;
    col9?: string;
    col10?: string;
    col11?: string;
    col12?: string;
    col13?: string;
    col14?: string;
    col15?: string;
    col16?: string;
    col17?: string;
    col18?: string;
    col19?: string;
    col20?: string;
    col21?: string;
    col22?: string;
    col23?: string;
    col24?: string;
    col25?: string;
    col26?: string;
    col27?: string;
    col28?: string;
    col29?: string;
    col30?: string;
    
    col31?: string;
    col32?: string;
    col33?: string;
    col34?: string;
    col35?: string;
    col36?: string;
    col37?: string;



    constructor() { }
}

export class ArchivoCarga {
    nombre: string;
    proceso: string;
    errmsg: string;
    nombrearchivo: string;
    tamanioarchivo: string;
    sheetName: string;
    constructor() { }
}


