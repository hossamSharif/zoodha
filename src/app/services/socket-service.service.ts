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
  //api = 'http://localhost:3000/'
  api ='https://coral-app-pr5y9.ondigitalocean.app/'
    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    public liveStremUserHadJoined: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserHadBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremAuctionHadEndOnTime: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosLostToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    constructor(public http: HttpClient ) {}
  
  //  socket = io('http://localhost:3000/',{ transports: ['websocket', 'polling', 'flashsocket'] });
    socket = io('https://coral-app-pr5y9.ondigitalocean.app/',{ transports: ['websocket', 'polling', 'flashsocket'] });
  
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
      //console.log('msg',  phone ,code)
      let msg = 'your verify code is : '+code
      let senderId ='Farhatna'
      phone = '249'+phone
      return this.http.get('https://mazinhost.com/smsv1/sms/api?action=send-sms&api_key=aG9zc2Ftc2hhcmlmMTk5MEBnbWFpbC5jb206cHVjJHYxQlB4dA==&to='+phone+'&from='+senderId+'&sms='+msg)
    }

    getAuction(id){ 
      //console.log('this.auctionId from live service',  id)
      let params = new HttpParams() 
      params=params.append('id' , id)
      return this.http.get(this.api+'auctions/'+id)
    }
    
    getOrder(id){ 
      //console.log('this.auctionId from live service',  id)
      let params = new HttpParams() 
      params=params.append('id' , id)
      return this.http.get(this.api+'orders/'+id)
    }

    getUserOrder(userId){ 
      //console.log('this.auctionId from live service',  userId)
      let params = new HttpParams() 
      params=params.append('userId' , userId)
      return this.http.get(this.api+'orders/all/'+userId)
    }

    getBalance(userId){ 
      //console.log('this.auctionId from live service',  userId)
      let params = new HttpParams() 
      params=params.append('userId' , userId)
      return this.http.get(this.api+'transactions/balance/'+userId)
    }

    getAllTransaction(userId){ 
      //console.log('this.auctionId from live service',  userId)
      let params = new HttpParams() 
      params=params.append('userId' , userId)
      return this.http.get(this.api+'transactions/all/'+userId)
    }

    getAllAuction( ){  
      return this.http.get(this.api+'auctions/all')
    }


   validateAuctionBeforeSubiscribtion (id){ 
      //console.log('this.auctionId from live service',  id)
      let params = new HttpParams() 
      params=params.append('id' , id)
      return this.http.get(this.api+'auctions/validateauction/'+id)
    }

    getUserAuction(userId){ 
      //console.log('this.auctionId from live service',  userId)
      let params = new HttpParams() 
      params=params.append('userId' , userId)
      return this.http.get(this.api+'auctions/userauction/'+userId)
    }

    getNewAuction(){
      this.socket.on('create', function(room) {
        //console.log('room created aknolage'+room)
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

      endAuctionOntime(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/endAuctionOnTime/', auction)
      }

    updateAuctionUsers(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/updateAuctionUsers/', auction)
    }

    updateOrderStatus(order){ 
      let params = new HttpParams() 
      params=params.append('order' , order)
      return this.http.post(this.api+'orders/updateorderstatus/', order)
    }

    createTrans(trasaction){ 
      let params = new HttpParams() 
      params=params.append('trasaction' , trasaction)
      return this.http.post(this.api+'transactions/createtransaction/', trasaction)
    }

    cancelAuctionUsers(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/cancelAuctionUsers/', auction)
    }

    resubiscribeAuctionUsers(auction){ 
      let params = new HttpParams() 
      params=params.append('auction' , auction)
      return this.http.post(this.api+'auctions/resubiscribeAuctionUsers/', auction)
    }
    
    createTransaction(transaction){ 
      let params = new HttpParams() 
      params=params.append('transaction' , transaction)
      return this.http.post(this.api+'transactions/', transaction)
    }


    loginPhone(phone , imei){ 
      let params = new HttpParams() 
      params=params.append('phone' , phone)
      params=params.append('imei' , imei)
      return this.http.get(this.api+'users/loginphone/'+phone+'&'+imei)
    }

    loginEmail(email , password){ 
      let params = new HttpParams() 
      params=params.append('email' , email)
      params=params.append('password' , password)
      return this.http.get(this.api+'users/loginemail/'+email+'&'+password)
    }
    
    createUser(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/create/', user)
    }

    makePayment(info){ 
      //console.log('info',info)
      let params = new HttpParams()  
      params=params.append('info' , info)
      return this.http.post(this.api+'transactions/subescribestripe/', info)
    }

    sendMail(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/resetemail/', user)
    }

    updateUser(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/update/', user)
    }

    updatePass(user){ 
      let params = new HttpParams() 
      params=params.append('user' , user)
      return this.http.post(this.api+'users/updatepass/', user)
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
      //console.log(auctionRoom)
      this.socket.emit('joiningAuction', auctionRoom )
    }

    userJoinedAuction = () =>{
      this.socket.on('userJoindAuction', (auctionRoom) => { 
        //console.log(auctionRoom)
         this.liveStremUserHadJoined.next(auctionRoom)
        });
      return this.liveStremUserHadJoined.asObservable(); 
    }


    ///bidding proccess

    userBiddingInAuction(auctionRoom){ 
      //console.log(auctionRoom)
      this.socket.emit('biddingInAuction', auctionRoom )
    }

    userBiddedInAuction = () =>{
      this.socket.on('userBiddedInAuction', (auctionRoom) => { 
        //console.log(auctionRoom)
         this.liveStremUserHadBidding.next(auctionRoom)
        }); 
      return this.liveStremUserHadBidding.asObservable(); 
    }
/// mzad end on time 

    auctionEndOntime = () =>{
      this.socket.on('auctionEndOntime', (ar) => { 
        //console.log('auctionEndOntime' ,ar)
         this.liveStremAuctionHadEndOnTime.next(ar)
        }); 
      return this.liveStremAuctionHadEndOnTime.asObservable(); 
    }

    //fucos to bidding 
    userFucosBiddingInAuction(auctionRoom){ 
      //console.log(auctionRoom)
      this.socket.emit('fucosBiddingInAuction', auctionRoom )
    }
    
    userFucosedBiddedInAuction = () =>{
      this.socket.on('userFucosedBiddedInAuction', (auctionRoom) => { 
        //console.log(auctionRoom)
         this.liveStremUserFucosToBidding.next(auctionRoom)
        });
      return this.liveStremUserFucosToBidding.asObservable(); 
    }

    //lost fucos to bidding 
    userFucosLostBiddingInAuction(auctionRoom){ 
      //console.log(auctionRoom)
      this.socket.emit('fucosLostBiddingInAuction', auctionRoom )
    }
    
    userFucosedLostBiddedInAuction = () =>{
      this.socket.on('userFucosedlostBiddedInAuction', (auctionRoom) => { 
        //console.log(auctionRoom)
         this.liveStremUserFucosLostToBidding.next(auctionRoom)
        });
      return this.liveStremUserFucosLostToBidding.asObservable(); 
    }


  
    
  }
 



 



 