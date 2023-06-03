import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
 terms =[
  {
    "no":1,
    "term":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi, quibusdam ipsa nobis aut sunt ut! Fuga optio nobis corporis, minus possimus delectus! Alias ratione a quaerat quae expedita doloremque!"
  },
  {
    "no":1,
    "term":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi, quibusdam ipsa nobis aut sunt ut! Fuga optio nobis corporis, minus possimus delectus! Alias ratione a quaerat quae expedita doloremque!"
  },
  {
    "no":1,
    "term":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi, quibusdam ipsa nobis aut sunt ut! Fuga optio nobis corporis, minus possimus delectus! Alias ratione a quaerat quae expedita doloremque!"
  }
]
  constructor(private modalController:ModalController) { 
    
  }

  ngOnInit() {
    
  }

  async ok(type) {  
      await this.modalController.dismiss(type); 
  }

}
