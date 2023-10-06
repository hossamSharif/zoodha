import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LangServiceService } from './services/lang-service.service';
import { SocketServiceService } from './services/socket-service.service';
import { ErrModalPage } from './err-modal/err-modal.page';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appInfoArr:Array<any> = []
  constructor(private toast:ToastController ,private loadingController:LoadingController,private api:SocketServiceService,private storage: Storage,private platform: Platform,public toastController: ToastController ,private modalController:ModalController  , private langService:LangServiceService) {
    this.initializeApp()
  }

  initializeApp(){
    this.storage.create(); 
    this.langService.setInitialAppLangauge()
    this.getAppInfo()
  }
    getAppInfo(){
      this.presentLoadingWithOptions()
      this.api.getAppInfo().subscribe(data => {
        console.log('appInfo',data)
                  let res = data       
                  this.appInfoArr =  data['appInfo']
                  this.storage.set('APPINFO', data).then((response) => {
                    if(response){ 

                      }
              })     
      }, (err) => { 
       this.presentModal()
        
      },()=>{
       
      })
    }
  
    async presentToast(msg,color?) {
      const toast = await this.toast.create({
        message: msg,
        duration: 2000,
        color:color,
        cssClass:'cust_Toast',
        mode:'ios',
        position:'top' 
      });
      toast.present();
    }
  
  
     async presentModal(msg?, status?) {  
      const modal = await this.modalController.create({
        component: ErrModalPage ,
        componentProps: {
          "error":"",
          "status": ""
        }
      });
      
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          //console.log(dataReturned )
          this.doAfterDissmiss(dataReturned)
        }
      });
   
      return await modal.present(); 
     }
  
  
    reload(){
      this.initializeApp();
    }
  
    doAfterDissmiss(dataReturned){
      this.reload()
      // this.rout.navigate(['cart']);  
     }
  
    async presentLoadingWithOptions(msg?,status?) {
      const loading = await this.loadingController.create({
        spinner: 'bubbles',
        mode:'ios',
       duration: 2000,
        message: msg,
        translucent: true,
       // cssClass: 'custom-class custom-loading',
        backdropDismiss: false
      });
      await loading.present();
      const { role, data } = await loading.onDidDismiss() 
      //console.log('Loading dismissed with role:', role);
    }
 



}
