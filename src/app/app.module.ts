import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from "./app.component";
import * as bootstrap from 'bootstrap';
import * as slimScroll from 'jquery-slimscroll';
import { CoreModule } from './components/core/core.module';
import { ModalWarningResetSessionComponent } from './components/mainapp/modals/modal-warning-reset-session/modal-warning-reset-session.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSuccessSavingComponent } from './components/mainapp/modals/modal-success-saving/modal-success-saving.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, WebviewDirective, ModalWarningResetSessionComponent, ModalSuccessSavingComponent],
  entryComponents: [
    ModalWarningResetSessionComponent, ModalSuccessSavingComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    NgxSliderModule,
    NgbModule,
    HttpClientModule,
    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  providers: [ElectronService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
