import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  style:any = 'style2'
  spinner:boolean = false 
  ionicForm: FormGroup;
   user : { email:any  }
   isSubmitted :boolean = false
  constructor(private translate: TranslateService,private formBuilder: FormBuilder,private toast:ToastController,private route: ActivatedRoute,private storage: Storage, private rout : Router ,private api:SocketServiceService) {
   
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
   })

   }

  ngOnInit() {
    this.user = {email:""}
  }

  sendMail(){
    if(this.validate() == true){
      this.spinner = true
      this.api.sendMail(this.user).subscribe(data =>{
        //console.log('user was created',data)
        let res = data
        //console.log('email was sent',res['digit']) 
        let navigationExtras: NavigationExtras = {
          queryParams: {
            digit: JSON.stringify(res['digit']),
            user_info:JSON.stringify(res['user'])
          }
        }; 
        this.rout.navigate(['virefy-rest'], navigationExtras);  
        this.spinner = false 
      }, (err) => {
      //console.log(err); 
      this.spinner = false
      this.handleError(err.error.error) 
    },()=>{ 
    })
    }
  }

  handleError(msg){
   if (msg == "email not found"){ 
     
      this.presentToast(this.translate.instant('forgetPassword.errEmailNotFound') , 'danger') 

      return false
     }
     else if(!msg){
      this.presentToast(this.translate.instant('forgetPassword.errNetwork') , 'danger') 

    
      return false
    }
     else {
      this.presentToast(this.translate.instant('forgetPassword.errNetwork') , 'danger') 

      return false
     } 
  }

  get errorControl() {
    return this.ionicForm.controls;
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

  validate(){
    this.isSubmitted = true;
    if (this.ionicForm.valid == false) {
      //console.log('Please provide all the required values!') 
      return false
    }   else {
       return true
    }  
  }

  newPassword(){
    this.rout.navigate(['new-password']); 
  }


}
