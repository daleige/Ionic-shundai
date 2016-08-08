import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // 在这里，你可以做任何更高层次的原生的东西，你可能需要。
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
