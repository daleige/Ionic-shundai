import {Component} from '@angular/core';
import {NavController, Alert,ViewController} from 'ionic-angular';
import {Helper} from'../helper/helper';
import {Http, Headers, RequestOptions}from '@angular/http';
@Component({
  templateUrl: 'build/pages/issuer/issuer.html'
})
export class IssuerPage {
  id: any;
  private fabuUrl: string = 'http://119.29.140.85/index.php/task/new_task';
  helper: Helper;
  headers: Headers;
  options: RequestOptions;
  name: string;
  receive_express_phone: string;//预留手机号
  express_code: string;//快递公司代码
  receive_address: string;//收货地址
  express_info: string;//快递短信
  expect_money: string//支付金额
  school_code: string;//学校代码

  constructor(private nav: NavController, private http: Http,private viewCtrl:ViewController) {
    this.helper = new Helper(nav);
  }


  //发布按钮
  submitFaBu() {
    if (this.receive_express_phone == null || this.express_code == null
      || this.receive_address == null || this.express_info == null || this.expect_money == null
      || this.school_code == null || this.receive_express_phone == ''
      || this.express_code == '' || this.receive_address == '' || this.express_info == ''
      || this.expect_money == '' || this.school_code == '') {
      this.helper.presentToast('请补全任务信息后发布');
    } else {

      this.http.post(this.fabuUrl, this.helper.headleAjaxBodyParam({
        'launch_user_id': this.id,
        'receive_express_phone': this.receive_express_phone,
        'express_code': this.express_code,
        'receive_address': this.receive_address,
        'express_info': this.express_info,
        'expect_money': this.expect_money,
        'school_code': this.school_code
      }), this.options)
        .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            let alert = Alert.create({
              title: '提示',
              subTitle: '任务已成功悬赏至顺带平台，你可在我的任务-我发布的查看任务进度',
              buttons: [{
                text: '确认',
                handler: data => {
                  // this.receive_express_phone = null;
                  // this.express_code = null;
                  // this.receive_address = null;
                  // this.express_info = null;
                  // this.expect_money = null;
                  // this.school_code = null;
                }
              }]
            });
            this.nav.present(alert);
          } else {
            this.helper.presentToast('发布失败：' + response.info);
          }
        }, (err)=> {
          this.helper.presentToast('网络错误，请稍后再试!');
        });
    }
  }

  //页面加载完毕 出初始化数据
  ionViewLoaded() {
    this.headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
    let localData = JSON.stringify(window.localStorage);//把序列化的本地数据转成string
    let localJson = eval("(" + localData + ")");//user eval() string to json
    this.id = localJson.id;
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }
}
