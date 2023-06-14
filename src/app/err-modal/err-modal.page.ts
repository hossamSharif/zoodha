import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-err-modal',
  templateUrl: './err-modal.page.html',
  styleUrls: ['./err-modal.page.scss'],
})
export class ErrModalPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }


 

async dissmis(status) { 
  await this.modalController.dismiss(status);
}

}
