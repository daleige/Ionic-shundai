import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage, ViewController} from 'ionic-angular';
import {Helper} from '../helper/helper';
import {Http, Headers, RequestOptions}from '@angular/http';

@Component({
  templateUrl: 'build/pages/edit_info/editschool.html'
})

export class EditSchoolPage {
  id:string;
  school:string;
  schoolName:string;
  helper:Helper;
  headers:Headers;
  options:RequestOptions;
  local:Storage;
  private updataUrl:string = 'http://119.29.140.85/index.php/user/update_info';

  constructor(private nav:NavController, private http:Http, private viewCtrl:ViewController) {
    this.local = new Storage(LocalStorage);
    this.helper = new Helper(nav);
  }

  updataSchoolInfo() {
    if (this.school == '' || this.school == null) {
      this.helper.presentToast('请选择学校！');
    } else {
      this.schoolCodeToName();
      this.http.post(this.updataUrl, this.helper.headleAjaxBodyParam({
        'id': this.id,
        'school_code': this.school
      }), this.options)
        .subscribe((data)=> {
            let responese = data.json();
            if (responese.status) {
              this.helper.presentToast('更新成功！');
              this.local.set('school_code', this.school);
              this.local.set('school_name', this.schoolName);

              this.nav.pop();

            } else {
              this.helper.presentToast('更新失败：' + responese.info);
            }

          }
          , (err)=> {
            this.helper.presentToast('访问服务器失败，请稍后再试');

          });

    }

  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }

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

  //
  schoolCodeToName() {

    if (this.school == '1') {
      this.schoolName = '贵州财经大学(花溪校区)';
    } else if (this.school == '2') {
      this.schoolName = '贵州医科大学(花溪校区)';
    } else if (this.school == '3') {
      this.schoolName = '贵州师范大学(花溪校区)';
    } else if (this.school == '4') {
      this.schoolName = '贵州城市学院(花溪校区)';
    } else if (this.school == '5') {
      this.schoolName = '贵州轻工职业技术学院';
    } else if (this.school == '6') {
      this.schoolName = '贵州民族大学花溪校区(花溪校区)';
    }
  }
}
