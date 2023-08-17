import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { PopLangPage } from '../pop-lang/pop-lang.page';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  constructor(private  popoverController: PopoverController, private storage: Storage, private rout : Router) {

   }

  ngOnInit() {

  }

  logout(){
    this.storage.remove('token').then((response) => {
      //console.log(response)
      this.rout.navigate(['login']);  
      }) 
  }



  async presentPopLang(ev: any) {
    const popover = await this.popoverController.create({
      component: PopLangPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
 

// async presentPopCurren(ev: any) {
//   const popover = await this.popoverController.create({
//     component: Pop,
//     event: ev,
//     translucent: true
//   });
//   return await popover.present();
// }
 

  profile(){
    this.rout.navigate(['profile']);
  }

}
