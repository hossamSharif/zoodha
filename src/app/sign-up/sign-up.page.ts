import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('popover') popover;
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
  spinner:boolean = false 
  isSubmitted = false;
  isOpen = false;
  confirmPass:any = ""
  constructor(private formBuilder: FormBuilder,private toast:ToastController,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.ionicForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      fullName: ['', [Validators.required, Validators.minLength(4),Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      birth: ['',Validators.required],
      gender: [''],
      phone:['', [Validators.required, Validators.minLength(9),Validators.maxLength(9),Validators.pattern('^[0-9]+$')]],

    })
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
      }
    });    
   }

  ngOnInit() {
  
  }
  
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  genderChange(ev){
    console.log(ev)
  }

  get errorControl() {
    return this.ionicForm.controls;
  }


  dateChange(ev){
    console.log(ev.target.value)
    this.isOpen = false
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

  save(){
    if(this.validate() == true){
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
