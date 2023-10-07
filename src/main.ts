import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './enviornments/environment';
import { initializeApp } from 'firebase/app';

if (environment.production) {
  enableProdMode();
}

const firebaseConfig = environment.firebase;

initializeApp(firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
