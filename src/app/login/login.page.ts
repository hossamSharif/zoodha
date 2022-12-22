import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mode ='phone'
  phone :any 
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
  };
  constructor(private storage: Storage, private rout : Router ,private api:SocketServiceService) {
    this.USER_INFO = {
      _id: "" ,
      firstName: "",
      lastName :""
    } 
   }

  ngOnInit() {

  }

  login(){
    if(this.mode == 'phone'){
      this.loginPhone() 
    }
  }

  loginPhone(){
    this.api.loginPhone(this.phone).subscribe(data =>{
      console.log(data)
      let res = data 
      this.api.loginEmit(res['user']._id)
      this.USER_INFO._id = res['user']._id 
      this.USER_INFO.firstName = res['user'].firstName 
      this.USER_INFO.lastName = res['user'].lastName 

      this.storage.set('user_info', this.USER_INFO).then((response) => {
      
      })
      this.rout.navigate(['tabs']); 
    }, (err) => {
    console.log(err);
  })  
  }

  signUp(){
    this.rout.navigate(['sign-up']); 
  }
  
  froget(){
    this.rout.navigate(['forget-password']);  
  }

}
