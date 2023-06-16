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
 
 
  spinner:boolean = false 
  isSubmitted = false; 
  
  confirmPass:any = ""
  
  passType = 'password'
  confType = 'password'
  show :boolean = false
  showConf :boolean = false
   
  constructor(private modalController:ModalController,private formBuilder: FormBuilder,private toast:ToastController,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) { 

    this.ionicForm = this.formBuilder.group({ 
      password: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')]],
      confirmPass: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')]]
    })
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

  

}
