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
  // api = 'http://localhost:3000/'
   api ='https://coral-app-7hsef.ondigitalocean.app/'
    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    public liveStremUserHadJoined: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserHadBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public liveStremUserFucosLostToBidding: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    constructor(public http: HttpClient ) {}
  
    socket = io('https://coral-app-7hsef.ondigitalocean.app/',{ transports: ['websocket', 'polling', 'flashsocket'] });
  
    public sendMessage(message) {
      this.socket.emit('message', message);
    }
  
    public getNewMessage = () => {
      this.socket.on('message', (message) =>{
        this.message$.next(message);
      });
      
      return this.message$.asObservable();
    };


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

    loginPhone(phone){ 
      let params = new HttpParams() 
      params=params.append('phone' , phone)
      return this.http.get(this.api+'users/loginphone/'+phone)
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
 



 



 