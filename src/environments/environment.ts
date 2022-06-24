// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  msmtsPacientes: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-pacientes/api/busquedanss/',
  urlServOauth: 'http://localhost:8081',
  urlServCronicasReporte: 'http://localhost:8082',
 // urlServCatalogos: 'http://localhost:8084',
 
 urlServCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
 urlServCronicas: 'http://localhost:8085', 
  urlServNotas: 'http://localhost:8086',
  urlServEstudioMedicos: 'http://localhost:8088',
  urlSiteGoogleRecaptcha: 'https://www.google.com/recaptcha/api/siteverify',
  recaptcha: {
    siteKey: '6LdbfOUfAAAAACVHNAE5P66uCngEas0k6VpEywJR',
  },
  siteKey: '6LcjT7wfAAAAAJtcZyGa0K44UBogPnXoeCd2RAuC',
  secretKey: '6LcjT7wfAAAAAGj4dG-nQ258Nf8i2gEEqFIwZxC5',
  urlMSADCargasCatalogos: 'http://localhost:8092//msedsc-carga-catalogos',
  urlMSEDSCatalogos: 'http://localhost:8085/api/',
  urlMSADTCITAS: 'http://localhost:8090/api/', 
  urlControlArticulos:'http://localhost:8088'
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.