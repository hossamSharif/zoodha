import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
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
    orignalCode;
    phone:any
    ionicForm: FormGroup;
    spinner:boolean = false 
    isSubmitted = false;
    outdateCode = false;
  constructor(private toast:ToastController,private formBuilder: FormBuilder,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.USER_INFO = {
      firstName:"", 
      lastName:"", 
      fullName:"",
      type:"", 
      phone :"",
      contryCode :"",
      password:"",
      gender:"",
      email:"",
      userName:"",
      imei:"",
      birthDate:"",
      logMethod:"",
      imgUrl:""
    }
    this.route.queryParams.subscribe(params => {
      if (params && params.type) { 
        if(JSON.parse(params.type) == 'new'){
           this.orignalCode = JSON.parse(params.code)
          this.phone = JSON.parse(params.phone)
           console.log(JSON.parse(params.code))
        }else if(JSON.parse(params.type) == 'exist'){
          let jsd = JSON.parse(params.data)
          this.orignalCode = jsd.code 
          this.phone = jsd.user.phone 
         }  
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
          console.log('Please provide all the required values!') 
          return false
        } else if (this.outdateCode == true){ 
          this.presentToast(' انتهت المهلة ,إضغط إعادة ارسال للحصول علي رمز جديد' , 'danger')
        }
         else if (this.code != this.orignalCode){ 
            this.presentToast(' الرمز غير صحيح' , 'danger')
            return false
          }else{
           return true
          } 
      } 

      confirmAccount(){ 
        console.log('confirm')
        if (this.validate() == true){
          this.spinner = true
          this.route.queryParams.subscribe(params => {
            if (params && params.type ) {
              if(JSON.parse(params.type) == 'new'){ 
                let navigationExtras: NavigationExtras = {
                  queryParams: { 
                    phone:this.phone
                  }
                };
                this.spinner = false
                this.rout.navigate(['sign-up'], navigationExtras);
              }else if(JSON.parse(params.type) == 'exist'){ 
                this.spinner = true
                let jsd = JSON.parse(params.data)
                this.api.loginEmit(jsd._id) 
                console.log('efsd',params.data)
                this.USER_INFO =  jsd.user 
                this.storage.set('user_info', jsd).then((response) => {
                  if(response){
                     this.storage.set('token', jsd.token).then((response) => {
                      this.spinner = false
                     this.rout.navigate(['tabs/home']); 
                  }) 
                  }
                 
                })
                
              } 
            } 
          }); 

         
        } 
      }

      inputChang(ev){
        console.log(ev.target.value)
        // if(ev.target.value.length == 4 && this.validate() == true){
        //   this.confirmAccount()
        // }  
      }


      getsms(){
      //   let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
      //   this.api.sendsms(this.phone , seq).subscribe(data =>{
      //     console.log('sms req',data)
      //     let res = data 
      //     console.log('sms response',data)
      //     //add ionic plugin to detect the sms msg and get the use substring and procced the confirmation fuction auto
      //    // this.orignalCode = res 
      //   }, (err) => {
      //   console.log(err); 
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
