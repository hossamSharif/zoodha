import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocketServiceService } from '../services/socket-service.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
    };
    showEmpty : boolean = false
    showSkelton :boolean = false
    transactions:Array<any> = []
    walletBalance:any


    constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) { 
      this.storage.get('user_info').then((response) => {
        if (response) {
          this.USER_INFO = response.user
          console.log('kkkkkkkkkk',this.USER_INFO) 
           this.getWalletBalance()
        }
       });
     }


    getWalletBalance(){
        this.showSkelton = true 
        this.api.getBalance(this.USER_INFO._id).subscribe(data =>{
          console.log(data)
          let res = data['transaction'][0]
          this.walletBalance = res.balance
          this.getTransactions()
        }, (err) => {
        console.log(err);
      } ,
      ()=>{ 
      })  
    }
    
    getTransactions(){
      this.showSkelton = true 
      this.api.getAllTransaction(this.USER_INFO._id).subscribe(data =>{
        console.log(data)
        let res = data['transaction'] 
        this.transactions = res
        
      }, (err) => {
      console.log(err);
    } ,
    ()=>{ 
    })  
  } 


  ngOnInit() {

  }





}
