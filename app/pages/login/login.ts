import {Component} from '@angular/core';
import {Platform, NavController, Loading, Toast, Storage, LocalStorage} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {RegisterPage} from '../login/register';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from '../helper/helper';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  public username:string = "15685412820";
  public password:string = "123456";
  public loginUrl:string = "http://119.29.140.85/index.php/user/login";
  public userInfo:any; //用户信息
  local:Storage;
  loading = Loading.create({
    content: '',
    showBackdrop: false
  });
  helper:Helper;

  constructor(private nav:NavController, public platform:Platform, private http:Http) {
    this.local = new Storage(LocalStorage);
    this.helper = new Helper(nav);
  }

  //用户登录
  login() {
    //设置请求方式并请求接口
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    let options = new RequestOptions({
      headers: headers
    });

    if (this.username != "" && this.password != "") {
      this.nav.present(this.loading); //加载
      this.http.post(this.loginUrl, this.headleAjaxBodyParam({
        "phone": this.username,
        "password": this.password
      }), options)
        .subscribe((data) => {
            this.loading.dismiss();// dismiss loading
            let myData = data.json();
            if (myData.status) {
              let jsonData = myData.data;
              this.saveUserInfoToLocalStorage(jsonData);
              //跳转tabs页面
              this.nav.setPages([{page: TabsPage}], {
                animate: true
              });
            } else {
              this.loading.dismiss();//请求失败 dismiss 掉 loading
              this.presentToast("用户名或密码错误");
            }
          },
          (err) => {
            this.loading.dismiss();//请求失败 dismiss 掉 loading
          });

    } else {
      this.presentToast("用户名或密码不能为空");
    }


  }

  //保存用户信息到localstorage
  saveUserInfoToLocalStorage(data:any) {
    this.local.set("id", data.id);
    this.local.set("phone", data.phone);
    this.local.set("password", data.password);
    this.local.set("nick", data.nick);
    this.local.set("head_pic_url", data.head_pic_url);
    this.local.set("rank", data.rank);
    this.local.set("identity_status", data.identity_status);
    this.local.set("register_time", data.register_time);
    this.local.set("school_name", data.school_name);
    this.local.set("school_code", data.school_code);
    this.local.set("floor_address", data.floor_address);
  }

//跳转到注册界面
  goToRegister() {
    this.nav.push(RegisterPage);
  }

//用于处理请求中body格式
  headleAjaxBodyParam(param) {
    let bodyStr = [];
    for (let item in param) {
      bodyStr.push(item + '=' + param[item])
    }
    return bodyStr.join('&');
  }


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

//忘记密码
  forgetPassword() {

  }

}
