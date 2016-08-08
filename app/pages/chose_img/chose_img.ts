import {Component} from '@angular/core';
import {NavController, ActionSheet, ViewController, LocalStorage, Storage} from 'ionic-angular';
import {ImagePicker, Camera, Transfer} from 'ionic-native';
import {Http, Headers, RequestOptions}from '@angular/http';
import {Helper} from '../helper/helper';

@Component({
  templateUrl: 'build/pages/chose_img/chose_img.html'
})
export class ChoseImgPage {
  local: Storage;
  id: any;
  helper: Helper;
  img_url: string = 'images/user_head.jpg';
  headers: Headers;
  options: RequestOptions;
  private uploadImgUrl: string = 'http://119.29.140.85/index.php/user/upload_head';

  constructor(private nav: NavController, private viewCtrl: ViewController, private http: Http) {
    this.helper = new Helper(nav);
    this.local = new Storage(LocalStorage);
  }

  goBack() {
    this.nav.pop();
  }

  //选择用户头像
  choseUserHeadImg() {
    this.presentActionSheet();
  }
  presentActionSheet() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              allowEdit: true,
              correctOrientation: true
            }
            Camera.getPicture(options).then((imageData) => {
              this.img_url = imageData;
              // this.uploadImage();
              this.transferUpLoad();
            }, (err) => {

            });
          }
        }, {
          text: '从手机相册选择',
          handler: () => {
            this.helper.presentToast('开始调用相册');
            let options = {
              maximumImagesCount: 1,//选择一张图片
              width: 800,
              height: 800,
              quality: 80
            };
            ImagePicker.getPictures(options)
              .then((results) => {
                for (var i = 0; i < results.length; i++) {
                  this.img_url = results[i];
                }
                this.transferUpLoad();
              }, (err) => {

              });
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }

  //上传图片
  transferUpLoad() {
    const fileTransfer = new Transfer();
    var options: any;
    options = {
      fileKey: 'image',
      headers: {},
      params: {
        'id': this.id  //接口需要上传的参数
      }
    }
    fileTransfer.upload(this.img_url, this.uploadImgUrl, options)
      .then((data) => {
        let result = JSON.stringify(data);
        let rData = eval("(" + result + ")");//user eval() string to json
        //根据返回的json格式 读取到图片路径
        let back_img_url = 'http://119.29.140.85' + rData.response.data.head_path;

        this.helper.presentToast('头像上传成功！');
        this.local.set('head_pic_url', rData.response.data.head_path);
      }, (err) => {
        this.helper.presentToast('上传失败！');
      })
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
    this.img_url = 'http://119.29.140.85' + localJson.head_pic_url;
  }

  //每次加载页面初始化
  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }
}
