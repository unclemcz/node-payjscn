# node-payjscn接口文档

[![image](https://img.shields.io/badge/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83-node4.4.5-blue.svg)](https://nodejs.org/)
[![image](https://img.shields.io/badge/%E4%BE%9D%E8%B5%96-superagent-brightgreen.svg)](https://www.npmjs.com/package/superagent)

payjs.cn的nodejs封装。关于payjs，[可以参考这里](https://payjs.cn/ref/ZGKXLZ)。

## 说明
本项目包含两个你用得到的代码文件：config.js和pay.js，其中config.js是配置文件，需要你在这里配置payjs的商户码和授权码，pay.js是功能代码文件；由于仅封装了payjs接口的调用、签名生成、异步签名校验等功能，每个接口返回的是一个JSON格式数据，需要你结合业务代码自行处理，所有接口返回的数据格式属性，请直接参考[payjs](https://help.payjs.cn/)的官方文档，这里不再解释。
## 关于签名算法
签名算法来自[yi-ge/payjs/pay.js](https://github.com/yi-ge/payjs/blob/master/pay.js)。
## 要求
支持nodejs4以上版本，需要依赖superagent。
## 使用说明
请参考samples.js
#### 初始化
修改配置文件config.js：
```
var payjskey = ''; //payjs的授权码
var payjsmchid = ''; //payjs的商户码
```
将两文件引入自己的业务代码：
```
var cfg = require("./config.js"); 
var pay = require("./pay.js");
```
#### 扫码支付（主扫）
构建入参：
```
var params = {
  'mchid': cfg.payjsmchid,     //商户号
  'total_fee': 1,              //金额。单位：分
  'out_trade_no': '123456789', //用户端自主生成的订单号
  'body': '订单标题',           //订单标题
  'attach': '自定义数据',       //用户自定义数据，在notify的时候会原样返回
  'notify_url': ''             //接收微信支付异步通知的回调地址。必须为可直接访问的URL，不能带参数、session验证、csrf验证。留空则不通知
};
```
调用：

```
pay.native(params,function (msg) {
    console.log(msg);
    /**TODO 这里处理业务逻辑 */
});
```
#### 付款码支付（被扫）
构建入参：
```
var params = {
    'mchid': cfg.payjsmchid,     //商户号
    'total_fee': 1,              //金额。单位：分
    'out_trade_no': '123456789', //用户端自主生成的订单号
    'body': '订单标题',           //订单标题
    'attach': '自定义数据',       //用户自定义数据，在notify的时候会原样返回
    'auth_code': ''              //扫码支付授权码，设备读取用户微信中的条码或者二维码信息(注：用户刷卡条形码规则：18位纯数字，以10、11、12、13、14、15开头)
  };
```
调用：

```
pay.micropay(params,function (msg) {
      console.log(msg);
      /**TODO 这里处理业务逻辑 */
  });
```
#### 订单查询接口
构建参数：
```
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
```
调用：
```
pay.check(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});
```
#### 订单关闭接口
构建参数：
```
//截至2019-03-28本猿测试时，payjs_order_id为空会返回{} 测试时请注意
var params = {
  'payjs_order_id': '123456789'     //PAYJS 平台订单号
};
```
调用：
```
pay.close(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});
```
#### 撤销订单接口
构建参数：
```
//截至2019-03-28本猿测试时，找不到订单的时候会返回{} 请做好代码兼容
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
```
调用：
```
pay.reverse(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});
```
#### 退款接口
构建参数：
```
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
```
调用：
```
pay.refund(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});
```
#### 异步通知的签名校验
pay.notifyCheck()返回bool类型，校验成功返回true，否则返回false
```
var params=req.body; //获取post的参数
if(pay.notifyCheck(params)==true){
  //执行业务逻辑，成功后返回200
    res.send('success'); //注意要业务逻辑成功后返回
}else{
  //校验失败
  res.status(404);
}
```

#### 其他接口待补充
......
