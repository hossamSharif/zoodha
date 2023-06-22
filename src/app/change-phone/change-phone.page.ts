import { Component, OnInit } from '@angular/core';
import {  NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})

export class ChangePhonePage implements OnInit {
  errorLoad:boolean = false
  USER_INFO : { 
    firstName:any, 
    lastName:any, 
    fullName:any,
    type:any, 
    phone :any,
    contryCode :any,
    password:any,
    gender:Number,
    email:any,
    userName:any,
    imei:any,
    birthDate:any,
    logMethod:any,
    imgUrl:any
  };
  oldPhone:any =""
  ionicForm: FormGroup;
  spinner:boolean = false 
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder,private toast:ToastController,private api:SocketServiceService,private storage: Storage, private rout : Router) { 
    this.ionicForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9),Validators.pattern('^[0-9]+$')]],
   })
  }


  getProfile(){
    console.log('im here bro')
    this.storage.get('token').then((response) => { 
      if (response) {
        console.log('token',response) 
        this.api.auth(response).subscribe(data =>{
         console.log('authservices',data)
          this.USER_INFO = data['user']
          console.log (this.USER_INFO) 
          this.oldPhone = this.USER_INFO.phone 
        }, (err) => {
        console.log(err);
    this.errorLoad = true
        
      })      
      }else{
        this.rout.navigate(['login']); 
      } 
    });
  }
  reload(){
    this.errorLoad = false
    this.USER_INFO = undefined
    this.getProfile()
    }

  ngOnInit() {
    this.getProfile()
  }


  get errorControl() {
    return this.ionicForm.controls;
  }

  validate(){
    this.isSubmitted = true;
    if (this.ionicForm.valid == false) {
      console.log('Please provide all the required values!') 
      return false
    }else if (this.USER_INFO.phone == this.oldPhone){ 
     this.presentToast('ادخلت نفس الرقم القديم , الرجاء ادخال رقم اخر', 'danger') 
     return false
    }else if(this.USER_INFO.phone[0] != 9 && +this.USER_INFO.phone[0] != 1) { 
      console.log(this.USER_INFO.phone[0])
      this.presentToast('رقم الجوال غير صحيح' , 'danger') 
   } else{
     return true
    } 
   }
 
   updatePhone(){
     if(this.validate() == true){
       this.api.updateUser(this.USER_INFO).subscribe(data =>{
         console.log('user was updated',data)
         let res = data
         console.log('user was created',res['token']) 
         this.storage.set('token', res['token']).then((response) => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              type: JSON.stringify('exist'), 
              data: JSON.stringify(res)
            }
          }; 
          this.rout.navigate(['verify'], navigationExtras); 
         })  
       }, (err) => {
       console.log(); 
       this.handleError( err.error.error ) 
     })
     }
   }
 
     handleError(msg){
       if (msg == "duplicate phone") {   
         this.presentToast('رقم الهاتف موجود مسبقا , قم بتسجيل الدخول', 'danger') 
         return false
        } else if(!msg){
          this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
          return false
        }
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
