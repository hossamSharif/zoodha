"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9957],{9957:($,S,p)=>{p.r(S),p.d(S,{StripeWeb:()=>U});var o=p(5861),K=p(7423),l=p(2903),s=p(4132),c=(()=>{return(n=c||(c={})).Loaded="applePayLoaded",n.FailedToLoad="applePayFailedToLoad",n.Completed="applePayCompleted",n.Canceled="applePayCanceled",n.Failed="applePayFailed",n.DidSelectShippingContact="applePayDidSelectShippingContact",n.DidCreatePaymentMethod="applePayDidCreatePaymentMethod",c;var n})(),u=(()=>{return(n=u||(u={})).Loaded="googlePayLoaded",n.FailedToLoad="googlePayFailedToLoad",n.Completed="googlePayCompleted",n.Canceled="googlePayCanceled",n.Failed="googlePayFailed",u;var n})();const Z=(n=window)=>{if(typeof n>"u")return[];n.Ionic=n.Ionic||{};let t=n.Ionic.platforms;return null==t&&(t=n.Ionic.platforms=R(n),t.forEach(e=>n.document.documentElement.classList.add(`plt-${e}`))),t},R=n=>Object.keys(v).filter(t=>v[t](n)),f=n=>!!(d(n,/iPad/i)||d(n,/Macintosh/i)&&h(n)),C=n=>d(n,/android|sink/i),h=n=>z(n,"(any-pointer:coarse)"),g=n=>L(n)||A(n),L=n=>!!(n.cordova||n.phonegap||n.PhoneGap),A=n=>!!n.Capacitor?.isNative,d=(n,t)=>t.test(n.navigator.userAgent),z=(n,t)=>n.matchMedia(t).matches,v={ipad:f,iphone:n=>d(n,/iPhone/i),ios:n=>d(n,/iPhone|iPod/i)||f(n),android:C,phablet:n=>{const t=n.innerWidth,e=n.innerHeight,i=Math.min(t,e),a=Math.max(t,e);return i>390&&i<520&&a>620&&a<800},tablet:n=>{const t=n.innerWidth,e=n.innerHeight,i=Math.min(t,e),a=Math.max(t,e);return f(n)||(n=>C(n)&&!d(n,/mobile/i))(n)||i>460&&i<820&&a>780&&a<1400},cordova:L,capacitor:A,electron:n=>d(n,/electron/i),pwa:n=>!(!n.matchMedia("(display-mode: standalone)").matches&&!n.navigator.standalone),mobile:h,mobileweb:n=>h(n)&&!g(n),desktop:n=>!h(n),hybrid:g};class U extends K.Uw{constructor(){super({name:"Stripe",platforms:["web"]})}initialize(t){var e=this;return(0,o.Z)(function*(){if("string"!=typeof t.publishableKey||0===t.publishableKey.trim().length)throw new Error("you must provide a valid key");e.publishableKey=t.publishableKey,t.stripeAccount&&(e.stripeAccount=t.stripeAccount)})()}createPaymentSheet(t){var e=this;return(0,o.Z)(function*(){var i;e.publishableKey?(e.paymentSheet=document.createElement("stripe-payment-sheet"),null===(i=document.querySelector("body"))||void 0===i||i.appendChild(e.paymentSheet),yield customElements.whenDefined("stripe-payment-sheet"),e.paymentSheet.publishableKey=e.publishableKey,e.stripeAccount&&(e.paymentSheet.stripeAccount=e.stripeAccount),e.paymentSheet.applicationName="@capacitor-community/stripe",e.paymentSheet.intentClientSecret=t.paymentIntentClientSecret,e.paymentSheet.intentType="payment",void 0!==t.withZipCode&&(e.paymentSheet.zip=t.withZipCode),e.notifyListeners(l.Y.Loaded,null)):e.notifyListeners(l.Y.FailedToLoad,null)})()}presentPaymentSheet(){var t=this;return(0,o.Z)(function*(){if(!t.paymentSheet)throw new Error;const e=yield t.paymentSheet.present();if(void 0===e)return t.notifyListeners(l.Y.Canceled,null),{paymentResult:l.Y.Canceled};const{detail:{stripe:i,cardNumberElement:a}}=e,r=yield i.createPaymentMethod({type:"card",card:a});return t.paymentSheet.updateProgress("success"),t.paymentSheet.remove(),void 0!==r.error?(t.notifyListeners(l.Y.Failed,null),{paymentResult:l.Y.Failed}):(t.notifyListeners(l.Y.Completed,null),{paymentResult:l.Y.Completed})})()}createPaymentFlow(t){var e=this;return(0,o.Z)(function*(){var i;e.publishableKey?(e.paymentSheet=document.createElement("stripe-payment-sheet"),null===(i=document.querySelector("body"))||void 0===i||i.appendChild(e.paymentSheet),yield customElements.whenDefined("stripe-payment-sheet"),e.paymentSheet.publishableKey=e.publishableKey,e.stripeAccount&&(e.paymentSheet.stripeAccount=e.stripeAccount),e.paymentSheet.applicationName="@capacitor-community/stripe",t.hasOwnProperty("paymentIntentClientSecret")?(e.paymentSheet.intentType="payment",e.paymentSheet.intentClientSecret=t.paymentIntentClientSecret):(e.paymentSheet.intentType="setup",e.paymentSheet.intentClientSecret=t.setupIntentClientSecret),void 0!==t.withZipCode&&(e.paymentSheet.zip=t.withZipCode),((n,t)=>("string"==typeof n&&(t=n,n=void 0),(n=>Z(n))(n).includes(t)))(window,"ios")?(e.paymentSheet.buttonLabel="Add card",e.paymentSheet.sheetTitle="Add a card"):e.paymentSheet.buttonLabel="Add",e.notifyListeners(s.I.Loaded,null)):e.notifyListeners(s.I.FailedToLoad,null)})()}presentPaymentFlow(){var t=this;return(0,o.Z)(function*(){if(!t.paymentSheet)throw new Error;t.notifyListeners(s.I.Opened,null);const e=yield t.paymentSheet.present().catch(()=>{});if(void 0===e)throw t.notifyListeners(s.I.Canceled,null),new Error;const{detail:{stripe:i,cardNumberElement:a}}=e,{token:r}=yield i.createToken(a);if(void 0===r||void 0===r.card)throw new Error;return t.flowStripe=i,t.flowCardNumberElement=a,t.notifyListeners(s.I.Created,{cardNumber:r.card.last4}),{cardNumber:r.card.last4}})()}confirmPaymentFlow(){var t=this;return(0,o.Z)(function*(){if(!t.paymentSheet||!t.flowStripe||!t.flowCardNumberElement)throw new Error;return void 0!==(yield t.flowStripe.createPaymentMethod({type:"card",card:t.flowCardNumberElement})).error&&t.notifyListeners(s.I.Failed,null),t.paymentSheet.updateProgress("success"),t.paymentSheet.remove(),t.notifyListeners(s.I.Completed,null),{paymentResult:s.I.Completed}})()}isApplePayAvailable(){return this.isAvailable("applePay")}createApplePay(t){var e=this;return(0,o.Z)(function*(){e.publishableKey?(e.requestApplePay=yield e.createPaymentRequestButton(),e.requestApplePayOptions=t,e.notifyListeners(c.Loaded,null)):e.notifyListeners(c.FailedToLoad,null)})()}presentApplePay(){return this.presentPaymentRequestButton("applePay",this.requestApplePay,this.requestApplePayOptions,c)}isGooglePayAvailable(){return this.isAvailable("googlePay")}createGooglePay(t){var e=this;return(0,o.Z)(function*(){e.publishableKey?(e.requestGooglePay=yield e.createPaymentRequestButton(),e.requestGooglePayOptions=t,e.notifyListeners(u.Loaded,null)):e.notifyListeners(u.FailedToLoad,null)})()}presentGooglePay(){return this.presentPaymentRequestButton("googlePay",this.requestGooglePay,this.requestGooglePayOptions,u)}isAvailable(t){var e=this;return(0,o.Z)(function*(){var i;const a=document.createElement("stripe-payment-request-button");return a.id=`isAvailable-${t}`,null===(i=document.querySelector("body"))||void 0===i||i.appendChild(a),yield customElements.whenDefined("stripe-payment-request-button"),e.publishableKey&&(a.publishableKey=e.publishableKey),e.stripeAccount&&(a.stripeAccount=e.stripeAccount),a.applicationName="@capacitor-community/stripe",yield a.isAvailable(t).finally(()=>a.remove())})()}createPaymentRequestButton(){var t=this;return(0,o.Z)(function*(){var e;const i=document.createElement("stripe-payment-request-button");return null===(e=document.querySelector("body"))||void 0===e||e.appendChild(i),yield customElements.whenDefined("stripe-payment-request-button"),t.publishableKey&&(i.publishableKey=t.publishableKey),t.stripeAccount&&(i.stripeAccount=t.stripeAccount),i.applicationName="@capacitor-community/stripe",i})()}presentPaymentRequestButton(t,e,i,a){var r=this;return(0,o.Z)(function*(){return new Promise(function(){var _=(0,o.Z)(function*(y){if(void 0===e||void 0===i||void 0===r.publishableKey)return r.notifyListeners(a.Failed,null),y({paymentResult:a.Failed});yield e.setPaymentRequestOption({country:i.countryCode.toUpperCase(),currency:i.currency.toLowerCase(),total:i.paymentSummaryItems[i.paymentSummaryItems.length-1],disableWallets:"applePay"===t?["googlePay","browserCard"]:["applePay","browserCard"],requestPayerName:!0,requestPayerEmail:!0});const F=i.paymentIntentClientSecret;yield e.setPaymentMethodEventHandler(function(){var O=(0,o.Z)(function*(m,b){const{paymentIntent:P,error:I}=yield b.confirmCardPayment(F,{payment_method:m.paymentMethod.id},{handleActions:!1});if(I)return m.complete("fail"),r.notifyListeners(a.Failed,I),y({paymentResult:a.Failed});if("requires_action"===P?.status){const{error:w}=yield b.confirmCardPayment(F);if(w)return m.complete("fail"),r.notifyListeners(a.Failed,w),y({paymentResult:a.Failed})}return m.complete("success"),r.notifyListeners(a.Completed,null),y({paymentResult:a.Completed})});return function(m,b){return O.apply(this,arguments)}}()),yield e.initStripe(r.publishableKey,{stripeAccount:r.stripeAccount,showButton:!1})});return function(y){return _.apply(this,arguments)}}())})()}}}}]);