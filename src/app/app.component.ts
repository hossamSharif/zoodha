import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LangServiceService } from './services/lang-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: Storage , private langService:LangServiceService) {
    this.initializeApp()
  }

  initializeApp(){
    this.storage.create(); 
    this.langService.setInitialAppLangauge()
  }
}
