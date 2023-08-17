import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LangServiceService } from '../services/lang-service.service';

@Component({
  selector: 'app-pop-lang',
  templateUrl: './pop-lang.page.html',
  styleUrls: ['./pop-lang.page.scss'],
})
export class PopLangPage implements OnInit {
langauges= []
selected =''
  constructor(private popoverControler:PopoverController , private langServ : LangServiceService) { }

  ngOnInit() {
    this.langauges = this.langServ.getLangauges()
    this.selected = this.langServ.selected
  }

  select(lang){
   this.langServ.setLangauge(lang)
   this.popoverControler.dismiss()
  }

}
