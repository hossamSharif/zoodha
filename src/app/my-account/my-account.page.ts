import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router'
import { SocketServiceService } from '../services/socket-service.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  constructor(private storage: Storage, private rout : Router) {

   }

  ngOnInit() {

  }

  logout(){
    this.storage.remove('token').then((response) => {
      console.log(response)
      this.rout.navigate(['login']);  
      }) 
  }

  profile(){
    this.rout.navigate(['profile']);
  }

}
