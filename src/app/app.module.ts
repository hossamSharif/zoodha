import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule  } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { TabsPageRoutingModule } from '../app/tabs/tabs-routing.module';
import { AppComponent } from './app.component';
import {IonicStorageModule  } from '@ionic/storage-angular';
//import { DateAgoPipe } from './pipes/date-ago.pipe';
@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot(), AppRoutingModule ,TabsPageRoutingModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
