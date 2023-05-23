import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TermsPage } from '../terms/terms.page';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('popover') popover;
  verficStep:boolean 
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
    birthDate:any
  };
  ionicForm: FormGroup;
  ionic2Form: FormGroup;
  spinner:boolean = false 
  isSubmitted = false;
  isSubmitted2 = false;
  isOpen = false;
  confirmPass:any = ""
  agree:boolean = false
  passType = 'password'
  confType = 'password'
  show :boolean = false
  showConf :boolean = false
  code:any;
  orignalCode;
  outdateCode = false;
  constructor(private modalController:ModalController,private formBuilder: FormBuilder,private toast:ToastController,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.ionic2Form = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(4),Validators.pattern('^[0-9]+$')]],
   })
    this.ionicForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      fullName: ['', [Validators.required, Validators.minLength(4),Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      birth: ['',Validators.required],
      gender: [''],
      phone:['', [Validators.required, Validators.minLength(9),Validators.maxLength(9),Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(5),Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      confirmPass: ['', [Validators.required, Validators.minLength(5),Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      agree: ['', [Validators.required]]
    })
    //case signup with normal way , not using phone 
    this.USER_INFO = {
      firstName:"", 
      lastName:"", 
      fullName:"",
      type:"", 
      phone : undefined,
      contryCode :"",
      password:"",
      gender:undefined,
      email:"",
      userName:"",
      imei:"",
      birthDate:"",
    }

    this.route.queryParams.subscribe(params => {
      if (params && params.phone) {  
         this.USER_INFO = {
          firstName:"", 
          lastName:"", 
          fullName:"",
          type:"", 
          phone : JSON.parse(params.phone),
          contryCode :"",
          password:"", 
          gender:undefined,
          email:"",
          userName:"",
          imei:"",
          birthDate:"",
        }
      }else{

      }
    });    
   }

  ngOnInit() {
  
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


  showTerms(){

  }

  agreeCheck(ev){
    console.log(ev.target.checked)
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  getInfo(type){

  }
  genderChange(ev){
    console.log(ev)
  }

  get errorControl() {
    return this.ionicForm.controls;
  }


  get errorControl2() {
    return this.ionic2Form.controls;
  }

  dateChange(ev){
    console.log(ev.target.value)
    this.isOpen = false
   }

 
   getVirfyCode(type?,sendData?){
    let  seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) 
    return seq
    }


    confirmAccount(){

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


      validateCode(){
        this.isSubmitted2 = true;
        if (this.ionic2Form.valid == false) {
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

  validate(){
    this.isSubmitted = true;
    if (this.ionicForm.valid == false) {
      console.log('Please provide all the required values!') 
      return false
    } else if(this.USER_INFO.password.length>0 && this.USER_INFO.password != this.confirmPass){
      return false
    } else {
       return true
    }  
  }

  

  next(){
    if(this.validate() == true){
      this.verficStep = true
      this.orignalCode = this.getVirfyCode()
    } 
   }

  save(){
    if(this.validateCode() == true){
      this.spinner = true
      this.api.createUser(this.USER_INFO).subscribe(data =>{
        console.log('user was created',data)
        let res = data
        console.log('user was created',res['token'])
         
        this.storage.set('token', res['token']).then((response) => {
          this.rout.navigate(['tabs/home']); 
        }) 
      }, (err) => {
      console.log(err); 
      this.spinner = true
      this.handleError(err.error) 
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
        this.presentToast("البريد موجود مسبقا") 
        return false
       }  
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


async presentModal(id?, status?) { 
    
    const modal = await this.modalController.create({
      component: TermsPage ,
      componentProps: {
        "item":""
      }
    });
    
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('https://www.digitalocean.com/',dataReturned )
        this.doAfterDissmiss(dataReturned)
      }
    });
 
    return await modal.present(); 
  }

  doAfterDissmiss(dataReturned){

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

  login(){
    this.rout.navigate(['login']); 
  }

  changePhone(){
    console.log('asdhlaks')
    this.rout.navigate(['login']); 
  }

  froget(){
    this.rout.navigate(['forget-password']);  
  }

  verify(){
    this.rout.navigate(['verify']);  
  }
 
}
