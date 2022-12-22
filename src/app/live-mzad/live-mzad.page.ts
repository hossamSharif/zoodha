import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Observer, timer } from 'rxjs'; 
import { map, take } from "rxjs/operators";
import { MzadSubescribePage } from '../mzad-subescribe/mzad-subescribe.page';
import { SocketServiceService } from '../services/socket-service.service';
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
 
@Component({
  selector: 'app-live-mzad',
  templateUrl: './live-mzad.page.html',
  styleUrls: ['./live-mzad.page.scss'],
})
export class LiveMzadPage implements OnInit {
  mzad = { 
      "_id": "06e6f08e85e942d290ec642c14614637",
      "title": "iphone pro",
      "shortDescr": "iuhiuygi",
      "descr": "vhghvi87797",
      "imgs": [
        "jhohih"
      ],
      "start": {
        "$date": {
          "$numberLong": "1668202503976"
        }
      },
      "end": {
        "$date": {
          "$numberLong": "1668202503976"
        }
      },
      "currentStatus": 1,
      "fee": 0,
      "deposit": 0,
      "productPrice": 0,
      "minUsercount": 90,
      "contryCode": "249",
      "terms": [],
      "users": [
        {
          "userId":  "736fc6299c3a4269ace43b7641014af2",
          "status": 1,  
          "userName": "boorak", 
        },
        {
          "userId":  "700865bcaa934e5ebe956a2013c33395",
          "status": 1,  
          "userName": "hossam", 
        }
      ],
      "logs": [
        // {
        //   "userId": String ,
        //   "time": Date,
        //   "pay" : Number,
        //   "lastHighestPay": Number , //to confirm last payment that happend pefore this one
        //   }
      ],
      "createdAt": {
        "$date": {
          "$numberLong": "1668202503993"
        }
      },
      "updatedAt": {
        "$date": {
          "$numberLong": "1668202503993"
        }
      },
      "__v": 0
    
  
    }
    
 
    USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
    };
     auction_id :any ;
     highestBidd:any
     lastBidd4U:any
      timeLeft :any = {da:"" ,hr:"",mn:"" ,sc:"" } 
      bidPrice:any;
      showMe:boolean = false;
      mzd : any ;
      users : Array<any>=[];
      usersLogs : Array<any>=[];
      view:number ;
      showError:boolean = false
      msgError:string =""
      
      //time$ = timer(0, 1000).pipe(map(() => new Date()));
constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) {  
  this.route.queryParams.subscribe(params => {
          console.log('params',params)
          if (params && params.auction_id) {
            this.USER_INFO = JSON.parse(params.user_info);
            this.auction_id = JSON.parse(params.auction_id) 
            console.log( this.auction_id)
            this.getAuction()
          }
        });  
      }


  ngOnInit() { 
    //notify other when some how join live stream 
    this.socket.userJoinedAuction().subscribe((UserHadJoined: Array<any>) => { 
         console.log(UserHadJoined)
         if(UserHadJoined.length>0){
          this.presentToast(UserHadJoined[1] +"  إنضم" ,'success')
          //change user status from offline to online 
         }
    }) 

    //notify other when some how add bidding (listing)
    this.socket.userBiddedInAuction().subscribe((logArr: Array<any>) => { 
         console.log(logArr)
         if(logArr.length>0){
          this.presentToast(logArr[1].firstName + " " + logArr[0][0].pay ,'success')
          this.mzd['log']=logArr[0]
           this.prepareAuc() 
         }
    })


    //notify other when some how fucos input and start writting bid price (listing)

    this.socket.userFucosedBiddedInAuction().subscribe((logArr: Array<any>) => { 
         console.log(logArr)
         if(logArr.length>0){
        // this.presentToast(logArr[0].firstName  ,'success') 
         }
    })


     //notify other when some how fucos input and start writting bid price (listing)

     this.socket.userFucosedLostBiddedInAuction().subscribe((logArr: Array<any>) => { 
      console.log(logArr)
      if(logArr.length>0){
     // this.presentToast(logArr[0].firstName  ,'danger') 
      }
 })



  }

 



getAuction(){ 
    this.api.getAuction(this.auction_id).subscribe(data =>{
      console.log(data)
      let res = data['auction'][0][0]
      this.mzd = data['auction'][0][0]
      this.users = data['auction'][1]
      console.log('im here baby',this.mzd , 'users',this.users)
     this.prepareAuc()
    }, (err) => {
    console.log(err);
  })  
}

prepareAuc(){
    //ordering log depend on date desc
    // this.mzd['logs']=this.mzd['logs'].sort((x, y) => +new Date(x.time) > +new Date(y.time));
    this.mzd['logs']=  this.mzd['logs'].sort(function (a, b) {
      var dateA = new Date(a.time);
      var dateB = new Date(b.time);
      return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
    });
    console.log('sorting',  this.mzd['logs']) 
    //view time قبل دقيقتين 
     //use dateAgo pipe
     this.timeLeft = this.endAfterounter() 
     //get heigt price
    this.highestBidd =  this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
    console.log('highestBidd',this.highestBidd)
    //  last bidd for you
    let flt :Array<any> = [] 
    
     flt = this.mzd['logs'].filter(x=>x._id == this.USER_INFO._id)
    if(flt.length > 0){
      this.lastBidd4U =  flt[0].pay
      console.log('pay' , this.lastBidd4U)
    }else{
      this.lastBidd4U = 0
    }
    

    // prepare users Log
    if(this.mzd['logs'].length >2){
      this.getUserinfoLog('less')
    }else{
      this.getUserinfoLog('more')
    }
    
} 


getUserinfoLog(moreOrLess?){ 
  let length
  if(moreOrLess == 'less'){
    length = 2
  }else if(moreOrLess == 'more'){
    length = this.mzd['logs'].length
  } else{
    length = this.mzd['logs'].length 
  }
  this.usersLogs = []
  for (let index = 0; index < length; index++) {
    const element = this.mzd['logs'][index];
    let flt : Array<any> = [] 
    flt=  this.users.filter(x=>x._id == element.userId)
    if(flt.length>0){
      this.usersLogs.push({
        "userId": element.userId ,
        "time":  element.time,
        "pay" : +element.pay,
        "lastHighestPay": +element.lastHighestPay,
        "userName" : flt[0]['userName'] 
     })
    }
    
  } 
  this.view = 0  
  // this.mzd['logs'].forEach(element => {
  //    let flt =  this.users.filter(x=>x._id == element.userId)[0].userName
  //    this.usersLogs.push({
  //       "userId": element.userId ,
  //       "time":  element.time,
  //       "pay" : +element.pay,
  //       "lastHighestPay": +element.lastHighestPay,
  //       "userName" : flt 
  //    })
  // }); 
} 

startAfterounter(startDate){ 
  setInterval(function() {
    const timeLeft =  momentObj.duration(momentObj(startDate).diff(momentObj())); // get difference between now and timestamp
    console.log('days',timeLeft.days(),'hours',timeLeft.hours() , 'min',timeLeft.minutes() , 'econd',timeLeft.seconds());
    return timeLeft
}, 1000);
}

endAfterounter(){ 
  let offset =  momentTz().utcOffset()
  let newDate = momentObj(this.mzd['end']).add(); 
   console.log('init',this.mzd['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
  return new Observable<object>((observer: Observer<object>) => {
    setInterval(() => observer.next(
      {da:this.memnto(newDate).days().toString(),hr: this.memnto(newDate).hours().toString() ,mn:this.memnto(newDate).minutes().toString(),sc:this.memnto(newDate).seconds().toString()}
      ), 1000);
  });
}

memnto(newDate){  
    return momentObj.duration(momentObj(newDate).diff(momentObj()));
}

 viewMoreLess(){
    console.log(this.view)
    if(this.view == 0){
      this.getUserinfoLog('more')
      this.view = 1
    } else {
      this.getUserinfoLog('less')
      this.view = 0
    }
  }
 
validationPrice(type?){
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
   // not more than oppenning price   
   if( this.bidPrice <= this.mzd['productPrice'] - (0.3 * this.mzd['productPrice'])){
     if(type == 'btn'){
      this.showError = true
      this.msgError = 'اعلي من السعر الإفتتاحي'
     }else{ 
      this.presentToast('يحب المزايدة باعلي من السعر الإفتتاحي', 'danger')
      return true
     }
    } else if( this.bidPrice <= h){ // not  more than hhiiest bid 
    if(type == 'btn'){
      this.showError = true
      this.msgError ='اقل من المطلوب'
     }else{
      this.presentToast('المبلغ اقل من المطلوب', 'danger')
      this.presentToast('', 'danger')
      return false
     }
    } else if( this.bidPrice >= this.mzd['productPrice']){  // not more than product price
    if(type == 'btn'){
      this.showError = true
      this.msgError ='اعلي من سعر المنتج'
     }else{
      this.presentToast('المبلغ اعلي من سعر المنتج', 'danger')
      return false
     }
   }else{
    if(type == 'btn'){
      this.showError = false
     }else{ 
      return true
     }
   } 
}

bidChange(ev){
  console.log(ev)
  this.validationPrice('btn') 
}

 increase(bidPrice?){ 
 this.validationPrice('btn')
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
  if(bidPrice){
    this.bidPrice = this.bidPrice + 1
  }else{
    this.bidPrice = h + 1
  }  
  }

 decrease(bidPrice?){ 
  this.validationPrice('btn')
     let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
     if(bidPrice){
       this.bidPrice = this.bidPrice - 1
     }else{
       this.bidPrice = h 
     }    
 }

 focusBidding(ev){
  console.log (ev.target.value)
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
  if(ev.target.value>0){
    this.bidPrice = this.bidPrice + 1
  }else{
    this.bidPrice = h + 1
  }  
  this.socket.userFucosBiddingInAuction([this.USER_INFO, this.mzad._id ])
 }

 unCheckFocus(){
  console.log ('unCheckFocus')
  this.socket.userFucosLostBiddingInAuction([this.USER_INFO, this.mzad._id ])
  //  show indicator loader jst like typing...  
 }

 bidding(){ 
  if(this.validationPrice('submit') == true){
      let arr  = { 
        _id : this.mzd['_id'] ,
        log :[{
          "userId": this.USER_INFO._id ,
          "time":  new Date() ,
          "pay" : +this.bidPrice,
          "lastHighestPay": this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0) 
        }] 
      }

      // let arr  = { 
      //   _id : this.mzd['_id'] ,
      //   users :[{
      //     "userId":"736fc6299c3a4269ace43b7641014af2",
      //     "status":1
      //    },
      //    {
      //     "userId":"700865bcaa934e5ebe956a2013c33395",
      //     "status":1
      //    },
      //    {
      //     "userId":"88a8ff31502e4ad5b43152a4befa4756" ,
      //     "status":1
      //    } ] 
      // }

        this.api.updateAuctionsLog(arr).subscribe(data =>{
        console.log('auction update',data) 
        this.mzd = data['updatedLogAuction']
        console.log(this.mzd)
        // update log and hiegst price and
        this.prepareAuc()
        // animate heighst price and hand bidding
        this.animateLogAndprice()
        //alert others by new price using socket.io for room
        this.prepareBidding()  
        // let res = data['auction'][0]
        // this.mzad = res
        // console.log('im here baby',this.mzad)
      }, (err) => {
      console.log(err);
      })  
      //

        // add record to log 
        // animate input and highest bidding price
        // it done by addedd animation classes
        //show alert for other users using sockit 
        // it done by subiscribe  in ng on it


  } 
}








prepareBidding(){ 
  let log =[{
    "userId": this.USER_INFO._id , 
    "time":  new Date() ,
    "pay" : +this.bidPrice,
    "lastHighestPay": this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0) 
  }] 
  this.socket.userBiddingInAuction([log ,this.USER_INFO, this.mzad._id ])
}

animateLogAndprice(){
  this.showMe =true
  setTimeout(() => {
  this.showMe = false
}, 3000);
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

 //extra fuction
 getOffsetUtc(){
  let time = momentTz().tz('Africa/Cairo').format('HH:mm:ss z')
  let off =  momentTz(new Date()).utcOffset()
  let local = momentTz.tz.guess(this.mzd['end'])
  console.log('time' , time , 'offset' ,off ,'local' ,local)  
}

updateAuction(){
  // let st : Date = new Date('2022-11-11T21:35:03.976+00:00')
  // let en : Date = new Date('2022-11-11T21:35:03.976+00:00')
  // this.mzd[0].descr = '7ghutyasdadas'
  // this.mzd[0].fee = 19990000
  // this.mzd[0].start = st
  // this.mzd[0].end = en
  // this.mzd[0].logs.push({
  //  "price":123123,
  //  "userId":"kejrhoqieurhoq",
  //  "date":en
  // })
   
   this.api.updateAuctions(this.mzd[0]).subscribe(data =>{
   console.log('auction update',data)
   this.mzd = data['updatedLogAuction']
   console.log(this.mzd)
   // update log and hiegst price and
   // animate heighst price and hand bidding
   //alert others by new price using socket.io for room

   
   // let res = data['auction'][0]
   // this.mzad = res
   // console.log('im here baby',this.mzad)
 }, (err) => {
 console.log(err);
})  

}

updateTerms(){
 let arr  = { 
        _id : this.mzd['_id'] ,
        terms :[{
          "descr":"loakajskdfhdlak",
          "orderId":1
         },
         {
          "userId":"loakajskdfhdlak",
          "status":2
         },
         {
          "userId":"loakajskdfhdlak" ,
          "status":1
         } ] 
      } 

      this.api.updateAuctionsLog(arr).subscribe(data =>{
        console.log('auction update',data) 
        // this.mzd = data['updatedLogAuction']
        // console.log(this.mzd)
      })
}



}
