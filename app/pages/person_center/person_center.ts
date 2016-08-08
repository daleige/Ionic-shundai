import {Component} from '@angular/core';
import {NavController,ViewController} from 'ionic-angular';
import {ChoseImgPage} from '../chose_img/chose_img'
import {EditInfoPage} from '../edit_info/edit_info';
import {AddressPage} from '../address/address'
import {Helper} from '../helper/helper'
import {EditSchoolPage} from '../edit_info/editschool'

@Component({
  templateUrl: 'build/pages/person_center/person_center.html'
})
export class PersonCenterPage {

  username: string = '';
  school: string = '';
  address: string = '';
  img_url: string = '';
  phone: string = '';
  helper: Helper;

  constructor(private nav: NavController, private viewCtrl: ViewController) {
    this.helper = new Helper(nav);
  }

  goBack() {
    this.nav.pop();
  }

  showChoseImgPage() {
    this.nav.push(ChoseImgPage);
  }

  showEditInfoPage(editType: string) {
    this.nav.push(EditInfoPage, {'editType': editType});
  }

  showAddressPage() {
    this.nav.push(AddressPage);
  }

  //页面加载初始化localstorage数据
  ionViewDidEnter() {
    let localData = JSON.stringify(window.localStorage);//把序列化的本地数据转成string
    let localJson = eval("(" + localData + ")");//user eval() string to json
    this.address = localJson.floor_address;
    this.phone = localJson.phone;
    this.username = localJson.nick;
    this.school = localJson.school_name;
    this.img_url = 'http://119.29.140.85' + localJson.head_pic_url;

    if (this.username == '' || this.username == null) {
      this.username = '未设置';
    }
    if (this.address == '' || this.address == null) {
      this.address = '未设置';
    }
    if (this.phone == '' || this.phone == null) {
      this.phone = '未设置';
    }
    if (this.school == '' || this.school == null) {
      this.school = '未设置';
    }
    //如果未设置头像 显示默认头像
    if (localJson.head_pic_url == '' || localJson.head_pic_url == null) {
      this.img_url = 'images/user_head.jpg';
    }
  }

  //更新手机号码
  updataPhone() {
    this.helper.presentConfirm('暂不支持变更手机号码');
  }

  //更新学校
  showEditSchoolPage() {
    this.nav.push(EditSchoolPage);
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
    let localData = JSON.stringify(window.localStorage);//把序列化的本地数据转成string
    let localJson = eval("(" + localData + ")");//user eval() string to json
    this.img_url = 'http://119.29.140.85' + localJson.head_pic_url;//每次加载页面的时候更新最新图片
  }

}
