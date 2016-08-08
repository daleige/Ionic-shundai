import {NavController, Toast, Alert} from 'ionic-angular';

export class Helper {

  constructor(private nav:NavController) {
  }

  /*
   调用显示Toast
   text:需要Toast显示的内容
   */
  presentToast(text:string) {
    let toast = Toast.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDismiss(() => {
      //toast消失调用
    });
    this.nav.present(toast);
  }

  //用于处理请求中body格式
  headleAjaxBodyParam(param) {
    let bodyStr = [];
    for (let item in param) {
      bodyStr.push(item + '=' + param[item])
    }
    return bodyStr.join('&');
  }


  //消息提示框
  presentConfirm(text:string) {
    let alert = Alert.create({
      title: '提示',
      message: text,
      buttons: [
        {
          text: '确定',
          role: 'cancel',
        }
      ]
    });
    this.nav.present(alert);
  }
}


