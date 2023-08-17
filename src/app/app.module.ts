import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClient, HttpClientModule  } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { TabsPageRoutingModule } from '../app/tabs/tabs-routing.module';
import { AppComponent } from './app.component';
import {IonicStorageModule  } from '@ionic/storage-angular';
import { AuthGaurdService} from './auth/auth-gaurd.service';
import { AuthServiceService } from './auth/auth-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { TranslateModule ,TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 

//import { DateAgoPipe } from './pipes/date-ago.pipe';
export function createTranslateLoader(http:HttpClient){
  return new TranslateHttpLoader(http , 'assets/lang/' , '.json');
}


registerLocaleData(localeAr, 'ar');
@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,BrowserModule,FormsModule, ReactiveFormsModule,IonicModule.forRoot(),IonicStorageModule.forRoot(),
  TranslateModule.forRoot({
      loader : {
      provide:TranslateLoader,
      useFactory: (createTranslateLoader),
      deps:[HttpClient]
     }
    }),AppRoutingModule ,TabsPageRoutingModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },DatePipe,AuthServiceService,AuthGaurdService],
  bootstrap: [AppComponent],
})
export class AppModule {}
