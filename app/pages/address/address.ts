import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/address/address.html'
})
export class AddressPage {
  constructor(private nav:NavController) {
  }

  goBack() {
    this.nav.pop();
  }

}
