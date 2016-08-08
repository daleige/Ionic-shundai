import {Component} from '@angular/core';
import {NavController, ViewController, ActionSheet, Loading} from 'ionic-angular';
@Component({
  templateUrl: 'build/pages/home/PopoverPage.html'
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public nav: NavController) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  presentLoadingDefault() {
    let loading = Loading.create({
      content: '筛选功能待开发!'
    });

    this.nav.present(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

}
