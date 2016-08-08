import {Component} from '@angular/core';
import {NavController, Toast, NavParams, ViewController, Loading} from 'ionic-angular';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from '../helper/helper'
import {LoginPage} from "./login";
@Component({
  templateUrl: 'build/pages/login/register_sub.html'
})
export class RegisterSubPage {
  phone:string = '';
  password_1:string = '';
  password_2:string = '';
  private resigterUrl:string = 'http://119.29.140.85/index.php/user/register';
  helper:Helper;
  headers:Headers;
  options:RequestOptions;

  constructor(private nav:NavController, params:NavParams, private http:Http, private viewCtrl:ViewController) {
    this.phone = params.get('phone');
    this.helper = new Helper(nav);
  }

  goBack() {
    this.nav.pop();
  }

  register() {

    if (this.password_1.length < 6 || this.password_1.length < 6) {
      this.helper.presentToast('密码长度不能小于6位');
    } else if (this.password_1 != this.password_2) {
      this.helper.presentToast('两次密码输入不一致');
    } else {
      this.http.post(this.resigterUrl, this.headleAjaxBodyParam({
        'phone': this.phone,
        'password': this.password_1
      }), this.options).subscribe((data)=> {
        let response = data.json();
        if (response.status) {
          this.goBackLoginPage();
        } else {
          this.helper.presentToast('注册失败 失败原因：' + response.info);

        }
      }, (err)=> {
        this.helper.presentToast('注册失败 失败原因：网络连接失败！');

      });

    }

  }

  //调用Toast
  presentToast(text:string) {
    let toast = Toast.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDismiss(() => {
      //toast消失调用
    });
    this.nav.present(toast);
  }

  //页面加载完毕 出初始化数据
  ionViewLoaded() {
    this.headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
  }

  //用于处理请求中body格式
  headleAjaxBodyParam(param) {
    let bodyStr = [];
    for (let item in param) {
      bodyStr.push(item + '=' + param[item])
    }
    return bodyStr.join('&');
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }

  //
  // backLoginPage() {
  //   let alert = Alert.create({
  //     title: '注册成功',
  //     subTitle: '点击确认，为您跳转到登录页面'
  //     // buttons: ['OK']
  //   });
  //   this.nav.present(alert);
  // }


  goBackLoginPage() {
    let loading = Loading.create({
      // spinner:'hide', //隐藏进度款
      showBackdrop: false,
      content: '恭喜你注册成功，正在为您跳转至登录界面'
    });

    this.nav.present(loading);

    setTimeout(() => {
      loading.dismiss();
      this.nav.setPages([{page: LoginPage}], {
        animate: true
      });
    }, 3000);
  }

}
