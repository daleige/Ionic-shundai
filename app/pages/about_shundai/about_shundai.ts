import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SafariViewController} from 'ionic-native';
import {Helper} from '../helper/helper'

@Component({
  templateUrl: 'build/pages/about_shundai/about_shundai.html'
  // templateUrl:'http://119.29.140.85/'
})


export class AboutShunDaiPage {
  helper:Helper;

  constructor(private nav:NavController) {
    this.helper = new Helper(nav);

  }

  goBack() {
    this.nav.pop();
  }

  ionViewLoaded() {
    SafariViewController.isAvailable()
      .then(
        (available:boolean) => {
          if (available) {
            this.helper.presentToast('SafariViewController可用');

            SafariViewController.show({
              url: 'http://119.29.140.85/',
              hidden: false,
              animated: false,
              transition: 'curl',
              enterReaderModeIfAvailable: true,
              tintColor: '#ff0000'
            })
              .then(
                (result:any) => {
                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                (error:any) => console.error(error)
              );

          } else {
            this.helper.presentToast('SafariViewController不可用');
            window.open("http://119.29.140.85/", '_blank', 'location=yes');
          }
        }
      );
  }

}
