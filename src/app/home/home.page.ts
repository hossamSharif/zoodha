import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, timer ,Observer} from 'rxjs';
import { NavigationExtras, Router } from '@angular/router'
import { SocketServiceService } from "../services/socket-service.service"; 
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 
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

  constructor(private api:SocketServiceService,private datePipe:DatePipe ,private rout : Router ,private socket :SocketServiceService) {
    
  }

  ngOnInit() {
  //  this.socket.getNewAuction()
    this.getAllAuction()     
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
  })  
  }

  prepareAuc(){ 
    //set count down for auctions
       for (let index = 0; index < this.auctionsArray.length; index++) {
        const element = this.auctionsArray[index];
        element.timeLeft = this.endAfterounter(index)
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
        {da:this.memnto(newDate).days().toString(),hr: this.memnto(newDate).hours().toString() ,mn:this.memnto(newDate).minutes().toString(),sc:this.memnto(newDate).seconds().toString()}
        ), 1000);
    });
  }

memnto(newDate){  
  return momentObj.duration(momentObj(newDate).diff(momentObj()));
}
 

 
mazdDetails(id){
  let navigationExtras: NavigationExtras = {
    queryParams: {
      id: JSON.stringify(id)
    }
  };
  this.rout.navigate(['mazad-details'],navigationExtras); 
}



 
}
