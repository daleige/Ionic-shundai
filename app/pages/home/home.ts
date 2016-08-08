import {Component, ViewChild} from '@angular/core';
import {Platform, Loading, NavController, Popover, Alert, Toast, Storage, LocalStorage, Slides} from 'ionic-angular';
import {PopoverPage} from '../home/PopoverPage';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from'../helper/helper';
import {IssuerPage} from '../issuer/issuer';

@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

  @ViewChild('mySlider') slider: Slides;
  mySlideOptions = {
    autoplay: 2000,
    loop: true,
    direction: 'horizontal',
    pager: true,
  };

  id: string;
  public local: Storage;
  private taskListUrl: string = 'http://119.29.140.85/index.php/task/task_list';
  private startTaskUrl: string = 'http://119.29.140.85/index.php/task/start_task';
  helper: Helper;
  headers: Headers;
  options: RequestOptions;
  status: string; //任务状态
  express_code: string //快递公司代码
  school_code: string//学校代码
  page: number = 1;//初始化显示第一页
  page_size: number;//每页数据
  public items = []; //列表数据

  loading = Loading.create({
    content: '',
    showBackdrop: false
  });

  constructor(private nav: NavController, public platform: Platform, private http: Http) {
    this.local = new Storage(LocalStorage);
    this.helper = new Helper(nav);
  }

  presentPopover(myEvent) {
    let popover = Popover.create(PopoverPage);
    this.nav.present(popover, {
      ev: myEvent
    });
  }

  //确认领取任务
  shwoTastInfo(event, item) {
    let confirm = Alert.create({
      title: '确认领取任务',
      message: '是否确认领取任务单[' + item.id + ']，一旦领取您将必须在规定时间内完成该订单',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确认',
          handler: () => {
            this.http.post(this.startTaskUrl, this.helper.headleAjaxBodyParam({
              'task_id': item.id,
              'complete_user_id': this.id
            }), this.options)
              .subscribe((data)=> {
                let response = data.json();
                if (response.status) {
                  this.helper.presentToast('领取成功,可在我的任务查看任务信息');
                  for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i] == item) {
                      this.items.splice(i, 1);
                    }
                  }
                } else {
                  this.helper.presentToast('任务领取失败:' + response.info);
                }
              }, (err)=> {
                this.helper.presentToast('网络错误，任务领取失败!');
              });
          }
        }
      ]
    });

    this.nav.present(confirm);
  }

  //下拉刷新
  doRefresh(refresher) {
    this.http.post(this.taskListUrl, this.helper.headleAjaxBodyParam({'page_size': 10, 'status': 0}), this.options)
      .subscribe((data)=> {
        let response = data.json();
        if (response.status) {
          this.items = [];
          for (let i = 0; i < response.data.length; i++) {
            //清空items数据 加载最新数据
            this.items[i] = {
              'src': 'http://119.29.140.85' + response.data[i].launch_user_head_pic_url,
              'name': response.data[i].launch_nick,
              'KDName': response.data[i].express_name,
              'address': response.data[i].school_name,
              'id': response.data[i].id
            };
          }
          //复位下拉刷新
          refresher.complete();
          //页码制1
          this.page = 1;
        } else {
          this.helper.presentToast('数据初始化失败：' + response.info);
        }

      }, (err)=> {
        this.helper.presentToast('网络错误，数据初始化失败!');
      });
  }

  //toast提示
  presentToast() {
    let message: string = this.local.get('phone') .toString();
    let toast = Toast.create({
      // message: '已加载完成最新数据',
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.onDismiss(() => {

    });
    this.nav.present(toast);
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
    this.initData();//初始化任务列表数据

  }

  //初始化任务数据
  initData() {
    this.http.post(this.taskListUrl, this.helper.headleAjaxBodyParam({'page_size': 10, 'status': 0}), this.options)
      .subscribe((data)=> {
        let response = data.json();
        if (response.status) {
          this.loading.dismiss();
          this.items = [];
          for (let i = 0; i < response.data.length; i++) {
            this.items[i] = {
              'src': 'http://119.29.140.85' + response.data[i].launch_user_head_pic_url,
              'name': response.data[i].launch_nick,
              'KDName': response.data[i].express_name,
              'address': response.data[i].school_name,
              'id': response.data[i].id
            };
          }
        } else {
          this.helper.presentToast('数据初始化失败：' + response.info);
          this.loading.dismiss();
        }

      }, (err)=> {
        this.helper.presentToast('网络错误，数据初始化失败!');
        this.loading.dismiss();
      });
  }

  //上拉加载
  doInfinite(infiniteScroll) {
    //上拉加载前先为当前page++
    this.page++;
    this.http.post(this.taskListUrl, this.helper.headleAjaxBodyParam({
      'page_size': 10,
      'page': this.page,
      'status': 0
    }), this.options)
      .subscribe((data)=> {
        let response = data.json();


        if (response.data.length > 0) {
          if (response.status) {

            for (let i = 0; i < response.data.length; i++) {
              this.items[i + (this.page - 1) * 10] = {
                'src': 'http://119.29.140.85' + response.data[i].launch_user_head_pic_url,
                'name': response.data[i].launch_nick,
                'KDName': response.data[i].express_name,
                'address': response.data[i].school_name,
                'id': response.data[i].id
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

  //跳转发布任务界面
  showIssuerPage() {
    this.nav.push(IssuerPage);
  }

}
