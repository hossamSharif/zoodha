import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
const LNG_KEY = 'SELECTED_LANGAUGE'
@Injectable({
  providedIn: 'root'
})
export class LangServiceService {
 selected:''
  constructor(private translate: TranslateService ,private storage: Storage ) { 
    
  }


  setInitialAppLangauge(){
   let langauge : any = this.translate.getBrowserLang()
   this.translate.setDefaultLang(langauge)
   this.storage.get(LNG_KEY).then(val=>{
    if(val){
      this.setLangauge(val)
    }
   })
  }

  getLangauges(){
    return [
      {text:'English' , value: "en", img:"assets/imgs/en.png"},
      {text:'اللغة العربية' ,value :"ar", img:"assets/imgs/ar.png"}
    ]
  }

  setLangauge(lng){
    this.translate.use(lng)
    this.selected =lng
    this.storage.set(LNG_KEY , lng)
  }

}
