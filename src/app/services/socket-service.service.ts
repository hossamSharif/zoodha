import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Platform } from '@ionic/angular';
//import { environment } from '../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})


export class SocketServiceService { 
  api = 'http://localhost:3000/'
 //  api ='https://coral-app-7hsef.ondigitalocean.app/'
    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    public liveStremUserHadJoined: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserHadBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosLostToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    constructor(public http: HttpClient ) {}
  
    socket = io('http://localhost:3000/',{ transports: ['websocket', 'polling', 'flashsocket'] });
    // socket = io('https://coral-app-7hsef.ondigitalocean.app/',{ transports: ['websocket', 'polling', 'flashsocket'] });
  
    public sendMessage(message) {
      this.socket.emit('message', message);
    }
  
    public getNewMessage = () => {
      this.socket.on('message', (message) =>{
        this.message$.next(message);
      });
      
      return this.message$.asObservable();
    };



   sendsms(phone,code){ 
      console.log('msg',  phone ,code)
      let msg = 'your verify code is : '+code
      let senderId ='Farhatna'
      phone = '249'+phone
      return this.http.get('https://mazinhost.com/smsv1/sms/api?action=send-sms&api_key=aG9zc2Ftc2hhcmlmMTk5MEBnbWFpbC5jb206cHVjJHYxQlB4dA==&to='+phone+'&from='+senderId+'&sms='+msg)
    }

    getAuction(id){ 
      console.log('this.auctionId from live service',  id)
      let params = new HttpParams() 
      params=params.append('id' , id)
      return this.http.get(this.api+'auctions/'+id)
    }

    getAllAuction( ){  
      return this.http.get(this.api+'auctions/all')
    }

    getNewAuction(){
      this.socket.on('create', function(room) {
        console.log('room created aknolage'+room)
       // socket.join(room);
      }); 
    }

    loginEmit(id){
      this.socket.emit('identity', id);
    }

    updateAuctions(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/update/', auction)
    }

    updateAuctionsLog(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/updatelog/', auction)
    }

    loginPhone(phone , imei){ 
      let params = new HttpParams() 
      params=params.append('phone' , phone)
      params=params.append('imei' , imei)
      return this.http.get(this.api+'users/loginphone/'+phone+'&'+imei)
    }
    
    createUser(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/create/', user)
    }

    updateUser(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/update/', user)
    }

    updatePhone(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/updatephone/', user)
    }
    
    sendVirfyCode(code , number){ 
      let params = new HttpParams() 
      params=params.append('code' , code)
      params=params.append('number' , number)
      return this.http.get(this.api+'users/loginphone/'+code)
    }
    
    auth(token){ 
      let params = new HttpParams() 
      params=params.append('token' , token)
      return this.http.get(this.api+'users/auth/'+token)
    }

   userJoiningAuction(auctionRoom){ 
      console.log(auctionRoom)
      this.socket.emit('joiningAuction', auctionRoom )
    }

    userJoinedAuction = () =>{
      this.socket.on('userJoindAuction', (auctionRoom) => { 
        console.log(auctionRoom)
         this.liveStremUserHadJoined.next(auctionRoom)
        });
      return this.liveStremUserHadJoined.asObservable(); 
    }


    ///bidding proccess

    userBiddingInAuction(auctionRoom){ 
      console.log(auctionRoom)
      this.socket.emit('biddingInAuction', auctionRoom )
    }

    userBiddedInAuction = () =>{
      this.socket.on('userBiddedInAuction', (auctionRoom) => { 
        console.log(auctionRoom)
         this.liveStremUserHadBidding.next(auctionRoom)
        }); 
      return this.liveStremUserHadBidding.asObservable(); 
    }

    //fucos to bidding 
    userFucosBiddingInAuction(auctionRoom){ 
      console.log(auctionRoom)
      this.socket.emit('fucosBiddingInAuction', auctionRoom )
    }
    
    userFucosedBiddedInAuction = () =>{
      this.socket.on('userFucosedBiddedInAuction', (auctionRoom) => { 
        console.log(auctionRoom)
         this.liveStremUserFucosToBidding.next(auctionRoom)
        });
      return this.liveStremUserFucosToBidding.asObservable(); 
    }

    //lost fucos to bidding 
    userFucosLostBiddingInAuction(auctionRoom){ 
      console.log(auctionRoom)
      this.socket.emit('fucosLostBiddingInAuction', auctionRoom )
    }
    
    userFucosedLostBiddedInAuction = () =>{
      this.socket.on('userFucosedlostBiddedInAuction', (auctionRoom) => { 
        console.log(auctionRoom)
         this.liveStremUserFucosLostToBidding.next(auctionRoom)
        });
      return this.liveStremUserFucosLostToBidding.asObservable(); 
    }


  
    
  }
 



 



 