"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2199],{2199:(I,h,o)=>{o.r(h),o.d(h,{StripePaymentPageModule:()=>T});var m=o(6895),p=o(4006),y=o(3497),a=o(2485),g=o(7815),t=o(6738);const r=[{path:"",component:g.F}];let P=(()=>{class s{}return s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[a.Bz.forChild(r),a.Bz]}),s})(),T=(()=>{class s{}return s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[m.ez,p.u5,y.Pc,P]}),s})()},7815:(I,h,o)=>{o.d(h,{F:()=>T});var m=o(5861),p=o(529),y=o(2340),a=o(510),g=o(7224),t=o(6738),r=o(3497),P=o(4338);let T=(()=>{class s{constructor(e,i,n,l,u,c){this.toast=e,this.loadingController=i,this.modalCtrl=n,this.api=l,this.httpClient=u,this.http=c,this.data={},this.apis="https://coral-app-pr5y9.ondigitalocean.app/transactions/subescribestripe",a.hK.initialize({publishableKey:y.N.stripe.publishableKey})}httpPost(e){let i=new p.LE;return i=i.append("data",e),this.http.post(this.apis,e).pipe((0,g.P)())}closeModel(){this.modalCtrl.dismiss()}ngOnInit(){"order"==this.status?this.prepareOrder():this.prepareTransaction(),this.data={name:this.USER_INFO.fullName,email:this.USER_INFO.email,amount:this.amount,currency:"usd",transaction:this.trasaction}}prepareTransaction(){this.trasaction={_id:"",orderId:"",auctId:this.mzd._id,userId:this.USER_INFO._id,currentStatus:0,typee:1,pay:this.amount,details:"\u0633\u062f\u0627\u062f \u0641\u0627\u062a\u0648\u0631\u0629 \u0625\u0634\u0646\u0631\u0627\u0643 \u0641\u064a \u0645\u0632\u0627\u062f  "+this.mzd.title,comment:"\u0633\u062f\u0627\u062f \u0641\u0627\u062a\u0648\u0631\u0629 \u0625\u0634\u0646\u0631\u0627\u0643 \u0641\u064a \u0645\u0632\u0627\u062f  \u0645\u0646 \u0645\u0632\u0627\u062f : "+this.mzd.title+",\u0631\u0642\u0645: "+this.mzd._id,fromAccount:this.USER_INFO._id,toAccount:"310000205349900001",fromAccountTitle:"\u062d\u0633\u0627\u0628  : "+this.USER_INFO.fullName,toAccountTitle:"\u0634\u0631\u0643\u0629 \u0632\u0648\u0648\u062f\u0647\u0627"}}prepareOrder(){this.trasaction={_id:"",orderId:"",auctId:this.mzd._id,userId:this.USER_INFO._id,currentStatus:0,typee:1,pay:this.amount,details:"\u0633\u062f\u0627\u062f \u0641\u0627\u062a\u0648\u0631\u0629 \u0631\u0642\u0645  "+this.order._id,comment:"\u0633\u062f\u0627\u062f \u0641\u0627\u062a\u0648\u0631\u0629 \u0631\u0642\u0645  "+this.order._id+"\u0645\u0646 \u0645\u0632\u0627\u062f : "+this.order.auctions[0].title+",\u0631\u0642\u0645: "+this.order.auctions[0]._id,fromAccount:this.USER_INFO._id,toAccount:"310000205349900001",fromAccountTitle:"\u062d\u0633\u0627\u0628  : "+this.USER_INFO.firstName,toAccountTitle:"\u0634\u0631\u0643\u0629 \u0632\u0648\u0648\u062f\u0647\u0627"}}prepareUserbj(e){return e?{_id:this.mzd._id,user:[{userId:this.USER_INFO._id,cancel:0,cancelTime:null,reason:"",cancelTransId:""}]}:{_id:this.mzd._id,user:[{userId:this.USER_INFO._id,status:1,time:new Date,cancel:0,cancelTime:"",reason:"",transactionId:""}]}}prepareOrderbj(){return{_id:this.order._id,auctId:this.mzd._id,userId:this.USER_INFO._id,currentStatus:1}}subescribe(){this.presentLoadingWithOptions("\u062c\u0627\u0631\u064a \u0645\u0639\u0627\u0644\u062c\u0629 \u0637\u0644\u0628\u0643 .."),"order"==this.status?this.api.updateOrderStatus(this.prepareOrderbj()).subscribe(e=>{this.presentToast("\u062a\u0645 \u0627\u0644\u0625\u0634\u062a\u0631\u0627\u0643 \u0628\u0646\u062c\u0627\u062d ","success"),this.modalCtrl.dismiss(this.mzd,"done")},e=>{this.loadingController.dismiss()}):this.api.updateAuctionUsers(this.prepareUserbj()).subscribe(e=>{this.presentToast("\u062a\u0645 \u0627\u0644\u0625\u0634\u062a\u0631\u0627\u0643 \u0628\u0646\u062c\u0627\u062d ","success"),this.modalCtrl.dismiss(this.mzd,"done")},e=>{this.loadingController.dismiss()})}crateTrans(){this.api.createTrans(this.trasaction).subscribe(e=>{this.subescribe()},e=>{this.loadingController.dismiss()})}paymentSheet(){var e=this;return(0,m.Z)(function*(){try{a.hK.addListener(a.YG.Completed,()=>{});const i=e.httpPost(e.data);let n,l,u;yield i.subscribe(_=>{n=_.paymentIntent,l=_.ephemeralKey,u=_.customer}),yield a.hK.createPaymentSheet({paymentIntentClientSecret:n,customerId:u,customerEphemeralKeySecret:l,merchantDisplayName:"zoodoha"}),(yield a.hK.presentPaymentSheet()).paymentResult===a.YG.Completed&&e.crateTrans()}catch{}})()}PaymentFlowSheet(){var e=this;return(0,m.Z)(function*(){try{a.hK.addListener(a.I.Completed,()=>{});const i=e.httpPost(e.data);let n,l,u;yield i.subscribe(S=>{n=S.paymentIntent,l=S.ephemeralKey,u=S.customer}),a.hK.createPaymentFlow({paymentIntentClientSecret:n,merchantDisplayName:"zoodoha",customerEphemeralKeySecret:l,customerId:u}),yield a.hK.presentPaymentFlow(),yield a.hK.confirmPaymentFlow()}catch{}})()}presentLoadingWithOptions(e){var i=this;return(0,m.Z)(function*(){const n=yield i.loadingController.create({spinner:"bubbles",mode:"ios",duration:5e3,message:e,translucent:!0,backdropDismiss:!1});yield n.present(),yield n.onDidDismiss()})()}presentToast(e,i){var n=this;return(0,m.Z)(function*(){(yield n.toast.create({message:e,duration:2e3,color:i,cssClass:"cust_Toast",mode:"ios",position:"top"})).present()})()}}return s.\u0275fac=function(e){return new(e||s)(t.Y36(r.yF),t.Y36(r.HT),t.Y36(r.IN),t.Y36(P.D),t.Y36(p.JF),t.Y36(p.eN))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-stripe-payment"]],decls:38,vars:3,consts:[["color","light"],["slot","start"],["fill","clear",3,"click"],["name","close-circle-outline","color","dark"],["dir","rtl"],[1,"ion-margin-top"],["button","",3,"click"],["slot","start","name","card-outline","color","dark"],["slot","end"],["button","","disabled","true",1,"ion-margin-top",3,"click"],["slot","start","name","logo-google","color","danger"],["slot","start","name","logo-apple"]],template:function(e,i){1&e&&(t.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),t.NdJ("click",function(){return i.closeModel()}),t._UZ(4,"ion-icon",3),t.qZA()(),t._UZ(5,"ion-title"),t.qZA()(),t.TgZ(6,"ion-content",4)(7,"ion-list",5)(8,"ion-item",6),t.NdJ("click",function(){return i.paymentSheet()}),t._UZ(9,"ion-icon",7),t.TgZ(10,"ion-label"),t._uU(11,"\u062f\u0641\u0639 \u0639\u0628\u0631 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 "),t.qZA(),t.TgZ(12,"ion-label",8)(13,"ion-note"),t._uU(14,"usd"),t.qZA(),t._uU(15," \xa0"),t.TgZ(16,"ion-text"),t._uU(17),t.qZA()()(),t.TgZ(18,"ion-item",9),t.NdJ("click",function(){return i.paymentSheet()}),t._UZ(19,"ion-icon",10),t.TgZ(20,"ion-label"),t._uU(21," \u062f\u0641\u0639 \u0639\u0628\u0631 \u0642\u0648\u0642\u0644 \u0628\u0627\u064a "),t.qZA(),t.TgZ(22,"ion-label",8)(23,"ion-note"),t._uU(24,"usd"),t.qZA(),t._uU(25," \xa0 "),t.TgZ(26,"ion-text"),t._uU(27),t.qZA()()(),t.TgZ(28,"ion-item",9),t.NdJ("click",function(){return i.paymentSheet()}),t._UZ(29,"ion-icon",11),t.TgZ(30,"ion-label"),t._uU(31," \u062f\u0641\u0639 \u0639\u0628\u0631 \u0627\u0628\u0644 \u0628\u0627\u064a "),t.qZA(),t.TgZ(32,"ion-label",8)(33,"ion-note"),t._uU(34,"usd"),t.qZA(),t._uU(35," \xa0 "),t.TgZ(36,"ion-text"),t._uU(37),t.qZA()()()()()),2&e&&(t.xp6(17),t.Oqu(i.amount),t.xp6(10),t.Oqu(i.amount),t.xp6(10),t.Oqu(i.amount))},dependencies:[r.YG,r.Sm,r.W2,r.Gu,r.gu,r.Ie,r.Q$,r.q_,r.uN,r.yW,r.wd,r.sr],styles:[".header-md[_ngcontent-%COMP%]:after{background-image:none}"]}),s})()}}]);