import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-virefy-rest',
  templateUrl: './virefy-rest.page.html',
  styleUrls: ['./virefy-rest.page.scss'],
})
export class VirefyRestPage implements OnInit {
  style:any = 'style2'
  USER_INFO : { 
    firstName:any, 
    lastName:any, 
    fullName:any,
    type:any, 
    phone :any,
    contryCode :any,
    password:any,
    gender:any,
    email:any,
    userName:any,
    imei:any,
    birthDate:any,
    logMethod:any,
    imgUrl:any
  };

    token:any
    code:any; 
    phone:any
    ionicForm: FormGroup;
    spinner:boolean = false 
    spinner2:boolean = false 
    isSubmitted = false;
    outdateCode = false;
    orignalCode;

    digit 
    user : {email:any}
  constructor(private translate: TranslateService,private toast:ToastController,private formBuilder: FormBuilder,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.user = { 
      email:""
    }

    
    this.route.queryParams.subscribe(params => {
      if (params && params.digit  && params.user_info) { 
        this.orignalCode =   JSON.parse(params.digit)   
        this.USER_INFO =   JSON.parse(params.user_info)   
         //this.timerKiller() //enable time killer fuction when you want to release v1 
      }
    });  
   
    this.ionicForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(4),Validators.pattern('^[0-9]+$')]],
   })
   }

  ngOnInit() {
   
  }
     get errorControl() {
              return this.ionicForm.controls;
         }

      timerKiller(){
        setTimeout(() => { 
          this.route.queryParams.subscribe(params => {
            if (params && params.type) {  
                this.outdateCode = true 
            }
          });  
        }, 180000);
      }
    
      validate(){
        this.isSubmitted = true;
        if (this.ionicForm.valid == false) {
          //console.log('Please provide all the required values!') 
          return false
        } else if (this.outdateCode == true){ 
         this.presentToast(this.translate.instant('virefy-reset.timeUp') , 'danger') 


        }
         else if (this.code != this.orignalCode){ 
          this.presentToast(this.translate.instant('virefy-reset.errCode') , 'danger') 

            return false
          }else{
           return true
          } 
      } 

      confirmAccount(){ 
        //console.log('confirm')
        if (this.validate() == true){
          this.spinner = true
          let navigationExtras: NavigationExtras = {
            queryParams: {
              user_info: JSON.stringify(this.USER_INFO)
            }
          }; 
          this.rout.navigate(['new-password'] , navigationExtras); 
          this.spinner = false
        } 
      }


      sendMail(){ 
          this.spinner2 = true
          this.user.email =this.USER_INFO.email;
          this.api.sendMail(this.user).subscribe(data =>{
          //console.log('user was created',data)
          let res = data
           //console.log('email was sent',res['digit']) 
           this.orignalCode = res['digit']
           this.spinner2 = false
         this.presentToast(this.translate.instant('virefy-reset.emailSent') , 'success') 

           
          }, (err) => {
          //console.log(err); 
          this.spinner2 = false
          this.handleError(err.error.error) 
        },()=>{
         
        })
        }
       

      handleError(msg){
        if (msg == "email not found"){ 
           
         this.presentToast(this.translate.instant('virefy-reset.errEmailNotFound') , 'danger') 

           return false
          } else if(!msg){
         this.presentToast(this.translate.instant('virefy-reset.errNetwork') , 'danger') 

           
            return false
          }else {
                  this.presentToast(this.translate.instant('virefy-reset.errNetwork') , 'danger') 

           return false
          } 
       }

      inputChang(ev){
        //console.log(ev.target.value)
        // if(ev.target.value.length == 4 && this.validate() == true){
        //   this.confirmAccount()
        // }  
      }


      getsms(){
      //   let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
      //   this.api.sendsms(this.phone , seq).subscribe(data =>{
      //     //console.log('sms req',data)
      //     let res = data 
      //     //console.log('sms response',data)
      //     //add ionic plugin to detect the sms msg and get the use substring and procced the confirmation fuction auto
      //    // this.orignalCode = res 
      //   }, (err) => {
      //   //console.log(err); 
      // })  
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
}