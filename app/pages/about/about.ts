import {Component} from '@angular/core';
import {NavController, Toast, Storage, LocalStorage, Loading, ViewController} from 'ionic-angular';
import {OrderInfoPage} from '../about/order_info';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from'../helper/helper';

@Component({
  templateUrl: 'build/pages/about/about.html'
})
export class AboutPage {

  public id: string;
  img_src: string;
  nick: string;

  private selfTastUrl: string = 'http://119.29.140.85/index.php/task/list_launch';
  private lingQuRul: string = 'http://119.29.140.85/index.php/task/list_complete';

  helper: Helper;
  headers: Headers;
  options: RequestOptions;
  local: Storage;
  page: number = 1;//默认第一页
  page_size: number = 10;


  loading = Loading.create({
    content: '',
    showBackdrop: false
  });

  pet: string = "puppies";//设置启动时默认选择puppies
  items1 = [];
  items2 = [];

  constructor(private nav: NavController, private http: Http, private viewCtrl: ViewController) {
    this.local = new Storage(LocalStorage);
    this.helper = new Helper(nav);
  }

  //下拉刷新
  doRefresh(refresher) {
    this.http.post(this.selfTastUrl, this.helper.headleAjaxBodyParam({
      'launch_user_id': this.id,
      'page_size': this.page_size,
      'page': 1
    }), this.options)
      .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.items1 = [];  //置空数据 从服务器重新拉取数据
            for (let i = 0; i < response.data.length; i++) {
              this.items1[i] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'complete_user_id': response.data[i].complete_user_id, //完成任务者ID
                'complete_user_nick': response.data[i].complete_user_nick,//完成任务者名字
                'complete_user_head_pic_url': 'http://119.29.140.85' + response.data[i].complete_user_head_pic_url,//完成任务者头像地址
                'complete_user_phone': response.data[i].complete_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
                'school_name': response.data[i].school_name,//学校名字
                'school_code': response.data[i].school_code//学校编码
              };
            }
            refresher.complete();
          } else {
            this.helper.presentToast('刷新失败:' + response.info);
            refresher.complete();
          }
        },
        (err)=> {
          this.helper.presentToast('网络错误，刷新失败,请稍后再试!');
          refresher.complete();
        });

    this.http.post(this.lingQuRul, this.helper.headleAjaxBodyParam({
      'complete_user_id': this.id,
      'status': 1,
      'page_size': this.page_size,
      'page': 1
    }), this.options)
      .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.loading.dismiss();
            this.items2 = [];
            for (let i = 0; i < response.data.length; i++) {
              this.items2[i] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'launch_user_id': response.data[i].launch_user_id,//任务发起者ID
                'launch_user_head_pic_url': 'http://119.29.140.85' + response.data[i].launch_user_head_pic_url, //发起任务者头像地址
                'launch_user_nick': response.data[i].launch_user_nick,//完成任务者头像地址
                'launch_user_phone': response.data[i].launch_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
              };
            }
            refresher.complete();
          } else {
            this.loading.dismiss();
            refresher.complete();
          }
        },
        (err)=> {
          this.loading.dismiss();
          refresher.complete();
        });
  }

  //toast提示
  presentToast() {
    let toast = Toast.create({
      message: '已加载完成最新数据',
      duration: 2000,
      position: 'middle'
    });
    toast.onDismiss(() => {
    });
    this.nav.present(toast);
  }


  //跳转订单信息页面
  showOrderInfor(event, item) {
    this.nav.push(OrderInfoPage, {'item': item});
    //this.tabs.showOrderInfoPage(item);
  }

  ionViewLoaded() {
    this.nav.present(this.loading);
    this.headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
    let localData = JSON.stringify(window.localStorage);//把序列化的本地数据转成string
    let localJson = eval("(" + localData + ")");//user eval() string to json
    this.id = localJson.id;
    this.img_src = localJson.head_pic_url;
    this.nick = localJson.nick;

    this.initData();//初始化任务列表数据

  }

  //初始化 加载数据
  initData() {
    this.http.post(this.selfTastUrl, this.helper.headleAjaxBodyParam({
      'launch_user_id': this.id,
      'page_size': this.page_size,
      'page': 1
    }), this.options)
      .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.loading.dismiss();
            this.items1 = [];
            for (let i = 0; i < response.data.length; i++) {
              this.items1[i] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'complete_user_id': response.data[i].complete_user_id, //完成任务者ID
                'complete_user_nick': response.data[i].complete_user_nick,//完成任务者名字
                'complete_user_head_pic_url': 'http://119.29.140.85' + response.data[i].complete_user_head_pic_url,//完成任务者头像地址
                'complete_user_phone': response.data[i].complete_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
                'school_name': response.data[i].school_name,//学校名字
                'school_code': response.data[i].school_code//学校编码
              };
            }
          } else {
            this.loading.dismiss();
          }
        },
        (err)=> {
          this.loading.dismiss();
        });

    this.http.post(this.lingQuRul, this.helper.headleAjaxBodyParam({
      'complete_user_id': this.id,
      'status': 1,
      'page_size': this.page_size,
      'page': 1
    }), this.options)
      .subscribe((data)=> {
          let response = data.json();
          if (response.status) {
            this.loading.dismiss();
            this.items2 = [];
            for (let i = 0; i < response.data.length; i++) {
              this.items2[i] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'launch_user_id': response.data[i].launch_user_id,//任务发起者ID
                'launch_user_head_pic_url': 'http://119.29.140.85' + response.data[i].launch_user_head_pic_url, //发起任务者头像地址
                'launch_user_nick': response.data[i].launch_user_nick,//完成任务者头像地址
                'launch_user_phone': response.data[i].launch_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
              };
            }
          } else {
            this.loading.dismiss();
          }
        },
        (err)=> {
          this.loading.dismiss();
        });
  }

  //上拉加载
  doInfinite(infiniteScroll) {
    //上拉加载前先为当前page++
    this.page++;
    this.http.post(this.selfTastUrl, this.helper.headleAjaxBodyParam({
      'launch_user_id': this.id,
      'page_size': this.page_size,
      'page': this.page
    }), this.options)
      .subscribe((data)=> {
        let response = data.json();
        if (response.data.length > 0) {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              this.items1[i + (this.page - 1) * 10] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'complete_user_id': response.data[i].complete_user_id, //完成任务者ID
                'complete_user_nick': response.data[i].complete_user_nick,//完成任务者名字
                'complete_user_head_pic_url': 'http://119.29.140.85' + response.data[i].complete_user_head_pic_url,//完成任务者头像地址
                'complete_user_phone': response.data[i].complete_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
                'school_name': response.data[i].school_name,//学校名字
                'school_code': response.data[i].school_code//学校编码
              };
            }
            infiniteScroll.complete();
          } else {
            this.helper.presentToast('数据初始化失败：' + response.info);
            infiniteScroll.complete();
          }
        } else {
          this.helper.presentToast('没有更多数据');
          infiniteScroll.enable(false);
          setTimeout(()=> {
              infiniteScroll.enable(true);
            }
            , 1000);
        }
      }, (err)=> {
        this.helper.presentToast('网络错误，数据初始化失败!');
        infiniteScroll.complete();
      });

    this.http.post(this.lingQuRul, this.helper.headleAjaxBodyParam({
      'complete_user_id': this.id,
      'status': 1,
      'page_size': this.page_size,
      'page': this.page
    }), this.options)
      .subscribe((data)=> {
        let response = data.json();
        if (response.data.length > 0) {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              this.items1[i + (this.page - 1) * 10] = {
                'img_src': 'http://119.29.140.85' + this.img_src,//我的头像图片地址
                'nick': this.nick,//发件人名字
                'id': response.data[i].id, //任务主键
                'launch_user_id': response.data[i].launch_user_id,//任务发起者ID
                'launch_user_head_pic_url': response.data[i].launch_user_head_pic_url, //发起任务者头像地址
                'launch_user_nick': 'http://119.29.140.85' + response.data[i].launch_user_nick,//完成任务者头像地址
                'launch_user_phone': response.data[i].launch_user_phone,//完成任务者电话
                'launch_time': response.data[i].launch_time,//发布时间
                'complete_time': response.data[i].complete_time,//完成时间
                'receive_express_name': response.data[i].receive_express_name,//取件人名字
                'receive_express_phone': response.data[i].receive_express_phone,//取件人电话
                'express_name': response.data[i].express_name,//快递名字
                'receive_address': response.data[i].receive_address,//收货的地址
                'express_info': response.data[i].express_info,//快递短信
              };
            }
            infiniteScroll.complete();
          } else {
            this.helper.presentToast('数据初始化失败：' + response.info);
            infiniteScroll.complete();
          }
        } else {
          this.helper.presentToast('没有更多数据');
          infiniteScroll.enable(false);
          setTimeout(()=> {
              infiniteScroll.enable(true);
            }
            , 1000);
        }
      }, (err)=> {
        this.helper.presentToast('网络错误，数据初始化失败!');
        infiniteScroll.complete();
      });
  }
}
