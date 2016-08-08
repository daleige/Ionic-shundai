import {Component} from '@angular/core';
import {NavController, ViewController, Alert} from 'ionic-angular';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from '../helper/helper';


@Component({
  templateUrl: 'build/pages/tast_appeal/tast_appeal.html'
})
export class TastAppealPage {
  id:any;
  headers:Headers;
  options:RequestOptions;
  tastId:string;
  appealReason:string;
  helper:Helper;
  private appealUrl:string = 'http://119.29.140.85/index.php/task/new_task_appeal';

  constructor(private nav:NavController, private http:Http, private viewCtrl:ViewController) {
    this.helper = new Helper(nav);
  }

  goBack() {
    this.nav.pop();
  }

  submitAppeal() {

    if (this.tastId == '' || this.tastId == null) {
      this.helper.presentToast('请输入任务单号!');
    } else if (this.appealReason == '' || this.appealReason == null) {
      this.helper.presentToast('请输入申诉原因!');
    } else {


      this.http.post(this.appealUrl, this.helper.headleAjaxBodyParam({
        'appeal_user_id': this.id,
        'task_number': this.tastId,
        'appeal_reason': this.appealReason,
      }), this.options).subscribe((data)=> {
        let response = data.json();
        if (response.status) {
          let alert = Alert.create({
            title: '提示',
            subTitle: '您的单号:' + this.tastId + '申诉已提交，顺带客服将在两个工作日内与您取得联系，请您耐心等待',
            buttons: ['确认']
          });
          this.nav.present(alert);
        } else {
          this.helper.presentToast('提交失败：' + response.info);
        }
      }, (err)=> {
        this.helper.presentToast('提交失败 请稍后再试!');
      });

    }

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
