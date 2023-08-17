import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"; 
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  ionicForm: FormGroup;
style:any = 'style2'
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
 
 
  spinner:boolean = false 
  isSubmitted = false;  
  confirmPass:any = "" 
  password:any = ""
  passType = 'password'
  confType = 'password'
  show :boolean = false
  showConf :boolean = false
   
  constructor(private modalController:ModalController,private formBuilder: FormBuilder,private toast:ToastController,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) { 

    this.ionicForm = this.formBuilder.group({ 
      password: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')]],
      confirmPass: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')]]
    })

     this.route.queryParams.subscribe(params => {
      if (params  && params.user_info) { 
        
        this.USER_INFO =   JSON.parse(params.user_info)   
         //this.timerKiller() //enable time killer fuction when you want to release v1 
      }
    });  
   
  }

  ngOnInit() {

  }

  newPassword(){
    this.rout.navigate(['login']);  
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  showPass(type){
    if(type == 'pass'){
      if(this.show == true){
        this.show = false
        this.passType = 'password'
        
      }else{
        this.show = true
        this.passType = 'text'

      }
    }else if(type == 'confirm'){
      if(this.showConf == true){
        this.showConf = false
        this.confType = 'password'
      }else{
        this.showConf = true
        this.confType = 'text'

      }
    } 
  }

  update(){
    if(this.validate() == true){
      this.spinner = true
      this.USER_INFO.logMethod = 1
      this.USER_INFO.password = this.password
      this.api.updatePass(this.USER_INFO).subscribe(data =>{
        //console.log('user was updated',data)
        let res = data
        //console.log('user was created',res['token']) 
        this.storage.set('token', res['token']).then((response) => {
          if(response){
            this.spinner=false
            this.rout.navigate(['tabs/home']);  
          }
        })  


      }, (err) => {
      //console.log(); 
      this.spinner = false
      // this.handleError( err.error.error ) 
      this.presentToast("حدث خطأ ما , حاول مرة اخري " ,  'danger') 
    
    },()=>{
    
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
    } else if (msg == "duplicate email"){ 
      this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
      return false
    } 
     else{
      this.presentToast("حدث خطأ ما , حاول مرة اخري " ,  'danger') 
      return false
     } 
  }



  validate(){
    this.isSubmitted = true; 
    if (this.ionicForm.valid == false) {
      //console.log('Please provide all the required values!') 
      return false
    } else if(this.password.length>0 && this.password != this.confirmPass){
      return false
    } else if(this.USER_INFO.password.length > 0 && this.USER_INFO.password == this.password){
      this.presentToast('لقد ادخلت كلمة مرورك القديمة , الرجاء ادخال كلمة مرور اخري') 
      return false
    } else {
       return true
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
