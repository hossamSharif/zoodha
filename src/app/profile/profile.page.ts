import { Component, OnInit ,ViewChild  } from '@angular/core';
import {  NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  errorLoad:boolean = false
  @ViewChild('popover') popover;
  USER_INFO : { 
    firstName:any, 
    lastName:any, 
    fullName:any,
    type:any, 
    phone :Number,
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
  ionicForm: FormGroup;
  spinner:boolean = false 
  isSubmitted = false;
  isOpen = false;
  constructor(private formBuilder: FormBuilder,private toast:ToastController,private api:SocketServiceService,private storage: Storage, private rout : Router ) {
   
    this.ionicForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      fullName: ['', [Validators.required, Validators.minLength(4),Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      birth: ['',Validators.required],
      gender: [0],
      password:[''],
      phone:['', [Validators.required, Validators.minLength(9),Validators.maxLength(9),Validators.pattern('^[0-9]+$')]],

    })
   }

  ngOnInit() {
    this.getProfile()
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
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

  get errorControl() {
    return this.ionicForm.controls;
  }

  dateChange(ev){
   console.log(ev.target.value)
   this.isOpen = false
  }

  genderChange(ev){
    console.log(ev)
   // this.USER_INFO.gender = +ev.detail.value
  }

  validate(){
    this.isSubmitted = true;
    if (this.ionicForm.valid == false) {
      console.log('Please provide all the required values!') 
      return false
    }  else {
       return true
      } 
  }

  update(){
    if(this.validate() == true){
      this.spinner = true
      this.api.updateUser(this.USER_INFO).subscribe(data =>{
        console.log('user was updated',data)
        let res = data
        console.log('user was created',res['token']) 
        this.storage.set('token', res['token']).then((response) => {
          this.rout.navigate(['tabs/home']); 
        })  
      }, (err) => {
      console.log(); 
      this.spinner = false
      this.handleError( err.error.error ) 
    },()=>{
      this.spinner = false
    })
    }
  }

    handleError(msg){
      if (msg == "duplicate phone") {   
        this.presentToast('رقم الهاتف موجود مسبقا , قم بتسجيل الدخول', 'danger') 
        return false
       } else if (msg == "duplicate email"){ 
        this.presentToast("البريد موجود مسبقا" ,  'danger') 
        return false
       } else if(!msg){
        this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
        return false
      } else {
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


  changePhone(){
    console.log('asdhlaks')
    this.rout.navigate(['change-phone']); 
  }

  changePass(){ 
   console.log('asdhlaks')
   let navigationExtras: NavigationExtras = {
    queryParams: {
      user_info: JSON.stringify(this.USER_INFO)
    }
  }; 
    this.rout.navigate(['new-password'] ,navigationExtras); 
   }


}
