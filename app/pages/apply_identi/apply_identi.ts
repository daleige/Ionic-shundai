import {Component} from '@angular/core';
import {NavController, ViewController, Alert} from 'ionic-angular';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from '../helper/helper';

@Component({
  templateUrl: 'build/pages/apply_identi/apply_identi.html'
})
export class ApplyIdentiPage {

  id:any;
  headers:Headers;
  options:RequestOptions;
  helper:Helper;
  tureName:string;
  identifyId:string;
  studentId:string;
  schoolCode:string;
  schoolName:string;
  private applyUrl:string = 'http://119.29.140.85/index.php/user/validate_user';

  constructor(private nav:NavController, private viewCtrl:ViewController, private http:Http) {
    this.helper = new Helper(nav);
  }

  submitInfo() {
    if (this.tureName == '' || this.identifyId == '' || this.studentId == '' || this.schoolCode == '' ||
      this.tureName == null || this.identifyId == null || this.studentId == null || this.schoolCode == null) {
      this.helper.presentToast('请补全信息后提交申请！');
    } else {

      this.http.post(this.applyUrl, this.helper.headleAjaxBodyParam({
        'user_id': this.id,
        'name': this.tureName,
        'idcard': this.identifyId,
        'student_id': this.studentId,
        'school_code': this.schoolCode
      }), this.options).subscribe((data)=> {
        let response = data.json();
        if (response.status) {
          let alert = Alert.create({
            title: '提示',
            subTitle: '您的实名认证申请已提交成功，待顺带客服审核通过。',
            buttons: ['确认']
          });
          this.nav.present(alert);
        } else {
          // this.helper.presentToast('提交失败：' + response.info);
          let alert = Alert.create({
            title: '提示',
            subTitle: '您的实名认证申请已提交成功，待顺带客服审核通过。',
            buttons: ['确认']
          });
          this.nav.present(alert);
        }
      }, (err)=> {
        this.helper.presentToast('提交失败 请稍后再试！')
      });
    }
  }

  goBack() {
    this.nav.pop();
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
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

}
