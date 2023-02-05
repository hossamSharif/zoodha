import { Component, OnInit } from '@angular/core';
import {  NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';  
import { of, forkJoin } from 'rxjs';
import { switchMap ,map,catchError  } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mode ='phone'
  phone :any 
  ionicForm: FormGroup;
  spinner:boolean =false
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder,private toast:ToastController,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.ionicForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9),Validators.pattern('^[0-9]+$')]],
   })
   }

  ngOnInit() {

  }



  get errorControl() {
    return this.ionicForm.controls;
  }


  login(){  
    if(this.mode == 'phone'){
      this.isSubmitted = true;
      if (this.ionicForm.valid == false) {
        console.log('Please provide all the required values!') 
      } else if(this.phone[0] != 9 && +this.phone[0] != 1) { 
         console.log(this.phone[0])
         this.presentToast('رقم الجوال غير صحيح' , 'danger') 
      } else {
        this.loginPhone()
      }
    }
  }
 

   genrateime(){
    let  seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
    return seq
   }
 
  loginPhone() {
    this.spinner = true
    this.api.loginPhone(this.phone, this.genrateime()).subscribe(data => {
      console.log(data)
      let res = data 
     // this.getsms('exist', res) // uncomment it after apply smsgetway 
      this.getVirfyCode('exist' , res) // comment it after apply smsgetway 
    }, (err) => {
      console.log(err.error.error);
      this.handleError(err.error.error)
      this.spinner = false 
    },()=>{
      this.spinner = false // move this line to send sms function when you enable it
    })
  }

  getsms(type,resdata){  
    this.api.sendsms(this.phone, resdata['code']).subscribe(data => {
      console.log('sms req', data)
      let res = data
      if (type == 'new') {
        this.getVirfyCode('new' , resdata) 
      } else if (type == 'exist') {
        this.getVirfyCode('exist' , resdata) 
      }
    }, (err) => {
      console.log(err);
      this.presentToast('Sms getway down','danger') 
    })
  }

  handleError(err){
    if (err.error == "No user with this phone found") {
      console.log('no user was found') 
    // this.getsms('new',err) // uncomment it after apply smsgetway 
     this.getVirfyCode('new' , err) // comment it after apply smsgetway 
    }else if(err.error == "another phone"){
      // to apply imei check uncmment the line in zoodohapi/controller/user.j function : loginPhone
      this.presentToast('seem you use another phone','danger') 
    } else{ 
      this.presentToast('','danger')
      console.log(err.kind)
    }
  }

 getVirfyCode(type?,sendData?){
  if(type == 'new'){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: JSON.stringify('new'),
        code: JSON.stringify(sendData.code),
        phone:JSON.stringify(this.phone)
      }
    };
    this.rout.navigate(['verify'], navigationExtras);
  }else if(type == 'exist'){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: JSON.stringify('exist'), 
        data: JSON.stringify(sendData)
      }
    }; 
    this.rout.navigate(['verify'], navigationExtras); 
  }  
  }

  //  loginPhone2(){
  //   let logphoneApi = this.api.loginPhone(this.phone , this.genrateime()).pipe(
  //     map((data) => { 
  //       return data;          // <-- return `data`
  //     }),
  //     catchError((error) => {
  //       console.log("error");
  //       this.handleError(error.error.error)
  //       return of(error);     // <-- remember you must return an observable from `catchError` operator
  //     })
  //   );
  
  //   let smsApi =  this.api.sendsms(this.phone , this.genrateime()).pipe(
  //     map((data) => {
  //       return data;          // <-- return `data`
  //     }),
  //     catchError((error) => {
  //       console.log("error");
  //       return of(error);     // <-- remember you must return an observable from `catchError` operator
  //     })
  //   );

  //   forkJoin([logphoneApi, smsApi]).subscribe((res) => {
  //    this.handl1(res[0],res[1])
       
      
  //   }, () => {
  //       // when observable is completed
  //   });
  // }

  // handl1(data1,data2){
  //   console.log(data1,data2);
  // }

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

  signUp(){
    this.rout.navigate(['sign-up']); 
  }
  
  froget(){
    this.rout.navigate(['forget-password']);  
  }

}
