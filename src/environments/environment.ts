// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    urlLogin: 'https://mts-qa.cloudapps.imss.gob.mx/login',

    //Agenda
    urlMSADCargasCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-carga-catalogos',
    //urlMSADCargasCatalogos: 'http://localhost:8080/msedsc-carga-catalogos',
    urlMSEDSCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos/api',
    urlMSADTCITAS: 'https://adt-qa.cloudapps.imss.gob.mx/msadt-citas/api',
    urlMSEDSCatalogosHorarios: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos/api',
    //urlMSEDSCHorarios: 'http://localhost:8080/msedsc-catalogos',
    urlMSEDSCHorarios: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',

    urlMSEDSCAgenda: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
    urlMSADTUSUARIOS:'https://adt-qa.cloudapps.imss.gob.mx/msedsc-usuarios/api',

    //Trabajo Social
    // msmtsPacientes: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-pacientes/api/busquedanss/',
    msmtsPacientes: 'http://localhost:8080/msmts-pacientes/api/busquedanss/',
    msmtsCronicasReporte: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-cronica-grupal/api',
    msmtsCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
    msmtsCronicas: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-cronica-grupal/api',
    msmtsNotas: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-notas/api',
    msmtsEstudioMedicos: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-estudios-medicos/api',
    // msmtsOauth: 'https://adt-qa.cloudapps.imss.gob.mx/msadt-auth/api/aplicacion',
    // urlServOauth: 'https://adt-qa.cloudapps.imss.gob.mx/msadt-auth/',
    //   msmtsOauth: 'http://localhost:8083',
     msmtsOauth: 'http://localhost:8081/msadt-auth',
    // msmtsOauth: 'https://adt-qa.cloudapps.imss.gob.mx',
    msmtsControlArticulos: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-ctrl-articulos/api',
    msmtsVolantesDonacion: "https://mts-qa.cloudapps.imss.gob.mx/msmts-donacion-sangre/api",
    msmtsServsProfesionales: "https://mts-qa.cloudapps.imss.gob.mx/msmts-servs-profesionales/api",
     //msmtsControlInterno:"http://localhost:8088/msmts-ctrl-interno/api/control/interno/certificado-defuncion",
    msmtsControlInterno:"https://mts-qa.cloudapps.imss.gob.mx/msmts-ctrl-interno/api/control/interno/certificado-defuncion",
    msmtsAvisosMP:"https://mts-qa.cloudapps.imss.gob.mx/msmts-minis-publico/api",
    urlSiteGoogleRecaptcha: 'https://www.google.com/recaptcha/api/siteverify',
    recaptcha: {
      siteKey: '6LdbfOUfAAAAACVHNAE5P66uCngEas0k6VpEywJR',
    },
    siteKey: '6LcjT7wfAAAAAJtcZyGa0K44UBogPnXoeCd2RAuC',
    secretKey: '6LcjT7wfAAAAAGj4dG-nQ258Nf8i2gEEqFIwZxC5',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
