import {Component} from '@angular/core';
import {NavController, ActionSheet, NavParams, Storage, LocalStorage, ViewController} from 'ionic-angular';
import {Helper} from '../helper/helper';
import {Http, Headers, RequestOptions}from '@angular/http';

@Component({
  templateUrl: 'build/pages/edit_info/edit_info.html'
})
export class EditInfoPage {
  hintContent:string;
  id:any;
  editType:string;
  data:string;
  private updataUrl:string = 'http://119.29.140.85/index.php/user/update_info';
  helper:Helper;
  headers:Headers;
  options:RequestOptions;
  local:Storage;


  constructor(private nav:NavController, private params:NavParams, private http:Http, private viewCtrl:ViewController) {
    this.local = new Storage(LocalStorage);
    this.editType = params.get('editType');
    this.helper = new Helper(nav);
  }

  //更新数据信息
  updataUserInfo() {
    if (this.data == null || this.data == '') {
      this.helper.presentToast('保存失败 内容不能为空！');
    } else if (this.editType == '1') {
      //编辑姓名
      this.http.post(this.updataUrl, this.helper.headleAjaxBodyParam({
        'id': this.id,
        'nick': this.data
      }), this.options)
        .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.helper.presentToast('更新成功');
            this.local.set('nick', this.data);
            this.nav.pop();
          } else {
            this.helper.presentToast('更新失败：' + response.info);
          }
        }, (err)=> {
          this.helper.presentToast('访问服务器失败，请稍后再试');
        });
    } else if (this.editType == '2') {
      //编辑电话

    } else if (this.editType == '3') {
      //编辑学校

    } else if (this.editType == '4') {
      //编辑地址
      this.http.post(this.updataUrl, this.helper.headleAjaxBodyParam({
        'id': this.id,
        'floor_address': this.data
      }), this.options)
        .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.helper.presentToast('更新成功');
            this.local.set('floor_address', this.data);
            this.nav.pop();
          } else {
            this.helper.presentToast('更新失败：' + response.info);
          }
        }, (err)=> {
          this.helper.presentToast('访问服务器失败，请稍后再试');
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

    if (this.editType == '1') {
      this.hintContent = '姓名';
    } else if (this.editType == '2') {
      this.hintContent = '手机';
    } else if (this.editType == '3') {
      this.hintContent = '学校';
    } else if (this.editType == '4') {
      this.hintContent = '具体楼层地址';
    }

  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }


}
