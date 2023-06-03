import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, timer ,Observer, using} from 'rxjs';
import { NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from "../services/socket-service.service"; 
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  errorLoad:boolean = false
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
};
  timeLeftArr :Array<Object> =[{da:String ,hr:String,mn:String ,sc:String }] 
  auctionsArray:Array<any>=[]

   slideOpts = {
    slidesPerView: 3,
    nitialSlide: 0
     }

       // (alias) timer(dueTime?: number | Date, periodOrScheduler?: number | SchedulerLike, scheduler?: SchedulerLike): Observable<number>
      // import timer
      // Creates an Observable that starts emitting after an dueTime and emits ever increasing numbers after each period of time thereafter.
      
      // Its like index /interval, but you can specify when should the emissions start.
      
      
      
      // timer returns an Observable that emits an infinite sequence of ascending integers, with a constant interval of time, period of your choosing between those emissions. The first emission happens after the specified dueTime. The initial delay may be a Date. By default, this operator uses the asyncScheduler SchedulerLike to provide a notion of time, but you may pass any SchedulerLike to it. If period is not specified, the output Observable emits only one value, 0. Otherwise, it emits an infinite sequence.
      
      // Examples
      // Emits ascending numbers, one every second (1000ms), starting after 3 seconds
      // import { timer } from 'rxjs';
      
      // const numbers = timer(3000, 1000);
      // numbers.subscribe(x => console.log(x));
      // Emits one number after five seconds
      // import { timer } from 'rxjs';
      
      // const numbers = timer(5000);
      // numbers.subscribe(x => console.log(x))

  constructor(private storage: Storage,private api:SocketServiceService,private datePipe:DatePipe ,private rout : Router ,private socket :SocketServiceService) {
    //  this.socket.getNewAuction()
  
  }

  ngOnInit() {
    this.storage.get('user_info').then((response) => {
      if (response) {
        
        this.USER_INFO = response.user
        console.log('kkkkkkkkkk',this.USER_INFO) 
        this.getAllAuction()  
      }
     });
   } 

   ionViewWillEnter(){
   
   }

  getAllAuction(){
    this.api.getAllAuction().subscribe(data =>{
      console.log(data)
      let res = data['auctions'] 
      this.auctionsArray = res
      console.log(this.auctionsArray)
      this.prepareAuc()
    }, (err) => {
    console.log(err);
    this.handleError(err.error.error)
  })  
  }

  reload(){
    this.errorLoad = false
    this.auctionsArray = undefined
    this.getAllAuction()
    }
    handleError(err){ 
      this.errorLoad = true
      // if (err.error == "No user with this phone found") {
      //   console.log('no user was found') 
      // // this.getsms('new',err) // uncomment it after apply smsgetway 
      // // this.getVirfyCode('new' , err) // comment it after apply smsgetway 
      // }else if(err.error == "another phone"){
      //   // to apply imei check uncmment the line in zoodohapi/controller/user.j function : loginPhone
      //   this.presentToast('seem you use another phone','danger') 
      // } else{ 
      //   this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
      //   console.log(err.kind)
      // }
    }

  prepareAuc(){ 
    //set count down for auctions
       for (let index = 0; index < this.auctionsArray.length; index++) {
        const element = this.auctionsArray[index];
        
        if(element.currentStatus == 1 ){
          element.timeLeft = this.startAfterounter(index)
          
        }else if (element.currentStatus == 2){
          //edit here
          element.timeLeft = this.endAfterounter(index)

        }else if (element.currentStatus == 3){
          //edit here
          element.timeLeft = this.endSinceAfterounter(index) 
        }  

        // userIn
         let fltuse:Array<any> =[]
         fltuse = element.users.filter(x=>x.userId ==  this.USER_INFO._id)
         console.log('fltuse'+index, fltuse )

        if(fltuse.length> 0 && element.currentStatus < 3 && fltuse[0].cancel == 0){
          element.userIn = true 
         }else if(fltuse.length> 0 && fltuse[0].cancel == 1){
          element.userOut = true 
         }else if(element.logs.length > 0 && fltuse.length> 0 && element.currentStatus == 3){
          // userWin
          let mx =  element.logs.reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0); 
          let flt = element.logs.filter(x=>x.pay == mx)
          console.log('userWin', mx , flt )
          if(flt[0].userId == this.USER_INFO._id){
           element.userWin = true
          }
         }

        //duration
        let du = momentObj.duration(momentObj(element.end).diff(momentObj(element.start)));
        let hr = ""
        let day = "" 
        let con = ""
        if(du.days() > 0){
          day = du.days().toString() + " يوم"  
        } 
        if(du.hours() > 0){
          hr =  du.hours().toString() + " ساعة"  
        }
        if(du.hours() > 0 && du.hours() > 0){
          con = " , " 
        }
        element.duration = day + con + hr 
       }
       console.log(this.auctionsArray) 
  }

  

  endAfterounter(index){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj(this.auctionsArray[index]['end']).add(); 
     console.log('init',this.auctionsArray[index]['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
    return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memntoEnd(newDate).asDays().toFixed(0).toString(),hr: this.memntoEnd(newDate).hours().toString() ,mn:this.memntoEnd(newDate).minutes().toString(),sc:this.memntoEnd(newDate).seconds().toString()}
        ), 1000);
    });
  }

  memntoEnd(newDate){  
    return momentObj.duration(momentObj(newDate).diff(momentObj()));
  }

  startAfterounter(index){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj(this.auctionsArray[index]['start']).add(); 
     console.log(momentObj(),'init',this.auctionsArray[index]['start'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
     return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memntoStart(newDate).asDays().toFixed(0).toString(),hr: this.memntoStart(newDate).hours().toString() ,mn:this.memntoStart(newDate).minutes().toString(),sc:this.memntoStart(newDate).seconds().toString()}
        ), 1000);
    });
  }

  memntoStart(newDate){  
    let today = new Date() 
    return momentObj.duration(momentObj(newDate).diff(momentObj(today)));
  }

  endSinceAfterounter(index){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj(this.auctionsArray[index]['end']).add(); 
     console.log(momentObj(),'init',this.auctionsArray[index]['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
     return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memnSinceEnd(newDate).asDays().toFixed(0).toString(),hr: this.memnSinceEnd(newDate).hours().toString() ,mn:this.memnSinceEnd(newDate).minutes().toString(),sc:this.memnSinceEnd(newDate).seconds().toString()}
        ), 1000);
    });
  }

  memnSinceEnd(newDate){  
    return momentObj.duration(momentObj().diff(momentObj(newDate)));
  }


 
mazdDetails(auct){
  let navigationExtras: NavigationExtras = {
    queryParams: {
      id: JSON.stringify(auct._id),
      user_info: JSON.stringify(this.USER_INFO )
    }
};


  if(auct.userIn == true && auct.currentStatus == 2){
   this.rout.navigate(['live-mzad'], navigationExtras); 
  } else if( auct.userWin == true ){ 
    // redirect to tabs/cart and pass _id to present details modal 
  this.rout.navigate(['order-details'],navigationExtras);
  }else if( auct.userOut == true && auct.currentStatus == 1){
    this.rout.navigate(['mazad-details'],navigationExtras);
  }else{
    this.rout.navigate(['mazad-details'],navigationExtras); 
  }
  
}



 
}
