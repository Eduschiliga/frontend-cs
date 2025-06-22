import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule), provideRouter(routes, withViewTransitions()),importProvidersFrom(BrowserAnimationsModule)


  ]
};
