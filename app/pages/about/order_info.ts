import {Component} from '@angular/core';
import {NavController, ViewController, Storage, LocalStorage, NavParams} from 'ionic-angular';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from'../helper/helper';
import {TastAppealPage} from '../tast_appeal/tast_appeal'


@Component({
  templateUrl: 'build/pages/about/order_info.html'
})
export class OrderInfoPage {

  item: any = [];
  helper: Helper;
  headers: Headers;
  options: RequestOptions;
  local: Storage;

  img_url: string = 'images/user_head.jpg';
  name: string = '';
  tastId: string = '';
  phone: string = '';
  kuaidiGS: string = '';
  schoolName: string = '';
  address: string = '';
  kuaidiDX: string = '';

  constructor(private nav: NavController, private viewCtrl: ViewController, private  params: NavParams, private http: Http) {
    this.local = new Storage(LocalStorage);
    this.helper = new Helper(nav);

    this.item = params.get('item');

    this.img_url = this.item.img_src;
    this.name = this.item.nick;
    this.tastId = this.item.id;
    this.phone = this.item.receive_express_phone;
    this.kuaidiGS = this.item.express_name;
    this.schoolName = this.item.school_name;
    this.address = this.item.receive_address;
    this.kuaidiDX = this.item.express_info;
  }

  goBack() {
    this.nav.pop();
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }

  goTastAppealPage() {
    // this.nav.setPages([{page: TastAppealPage}], {
    //   animate: true
    // });

    this.nav.push(TastAppealPage);
  }
}
