// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'dataportal-fb2e8',
    appId: '1:150717494068:web:befc32c50072a837f86b61',
    storageBucket: 'dataportal-fb2e8.appspot.com',
    apiKey: 'AIzaSyDrA0VivU5m5EQbqGq9JeTz58yvMMgcWGw',
    authDomain: 'dataportal-fb2e8.firebaseapp.com',
    messagingSenderId: '150717494068',
    measurementId: 'G-HJQ8WP8965',
  },
  backendRoot: 'http://localhost:8080',
  storageRoot: 'http://localhost:8090',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
