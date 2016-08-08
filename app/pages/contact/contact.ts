import {Component} from '@angular/core';
import {NavController, Alert, LocalStorage, Storage} from 'ionic-angular';
import {PersonCenterPage} from '../person_center/person_center';
import {ApplyIdentiPage} from '../apply_identi/apply_identi';
import {TastAppealPage} from  '../tast_appeal/tast_appeal';
import {SafariViewController} from 'ionic-native';
import {Helper} from '../helper/helper'
import {LoginPage} from '../login/login'

@Component({
  templateUrl: 'build/pages/contact/contact.html'
})
export class ContactPage {
  img_url: string = '';
  helper: Helper;
  local: Storage;

  constructor(private nav: NavController) {
    this.helper = new Helper(nav);
    this.local = new Storage(LocalStorage);
  }

  showBaseInfo() {
    this.nav.push(PersonCenterPage);
  }

  showApplyIdenti() {
    this.nav.push(ApplyIdentiPage);
  }

  showTastAppeal() {
    this.nav.push(TastAppealPage);
  }

  showAboutShunDai() {
    // this.nav.push(AboutShunDaiPage);
    this.showBrawa();
  }

  //显示浏览器
  showBrawa() {
    SafariViewController.isAvailable()
      .then(
        (available: boolean) => {
          if (available) {
            SafariViewController.show({
              url: 'http://119.29.140.85/',
              hidden: false,
              animated: false,
              transition: 'curl',
              enterReaderModeIfAvailable: true,
              tintColor: '#ff0000'
            })
              .then(
                (result: any) => {
                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                (error: any) => console.error(error)
              );
          } else {
            window.open("http://119.29.140.85/", '_blank', 'location=yes');
          }
        }
      );
  }


  ionViewDidEnter() {
    console.log('sssss');
    let localData = JSON.stringify(window.localStorage);//把序列化的本地数据转成string
    let localJson = eval("(" + localData + ")");//user eval() string to json、
    this.img_url = 'http://119.29.140.85' + localJson.head_pic_url;
    //如果未设置头像 显示默认头像
    if (localJson.head_pic_url == '' || localJson.head_pic_url == null) {
      this.img_url = 'images/user_head.jpg';
    }
  }

  //退出程序 清楚LocalStorage数据
  exit() {
    let confirm = Alert.create({
      title: '提示',
      message: '是否退出应用程序!',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确认',
          handler: () => {
            this.local.clear();
            this.nav.setPages([{page: LoginPage}], {animate: true});
          }
        }
      ]
    });
    this.nav.present(confirm);
  }
}
