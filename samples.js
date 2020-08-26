//引入config.js和pay.js
//config.js配置文件，请务必在该文件配置payjs的授权码和商户码
var cfg = require("./config.js"); 
var pay = require("./pay.js");


//以下为调用示例
//参数详细请参考payjs官方文档：https://help.payjs.cn/
//Native 扫码支付（主扫） API
var params = {
  'mchid': cfg.payjsmchid,     //商户号
  'total_fee': 1,              //金额。单位：分
  'out_trade_no': '123456789', //用户端自主生成的订单号
  'body': '订单标题',           //订单标题
  'attach': '自定义数据',       //用户自定义数据，在notify的时候会原样返回
  'notify_url': ''             //接收微信支付异步通知的回调地址。必须为可直接访问的URL，不能带参数、session验证、csrf验证。留空则不通知
};
pay.native(params,function (msg) {
    console.log(msg);
    /**TODO 这里处理业务逻辑 */
});

//付款码支付（被扫） API
var params = {
    'mchid': cfg.payjsmchid,     //商户号
    'total_fee': 1,              //金额。单位：分
    'out_trade_no': '123456789', //用户端自主生成的订单号
    'body': '订单标题',           //订单标题
    'attach': '自定义数据',       //用户自定义数据，在notify的时候会原样返回
    'auth_code': ''              //扫码支付授权码，设备读取用户微信中的条码或者二维码信息(注：用户刷卡条形码规则：18位纯数字，以10、11、12、13、14、15开头)
  };
pay.micropay(params,function (msg) {
    console.log(msg);
    /**TODO 这里处理业务逻辑 */
});

//订单查询接口
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
pay.check(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});

//订单关闭接口  
//截至2019-03-28本猿测试时，payjs_order_id为空会返回{} 测试时请注意
var params = {
  'payjs_order_id': '123456789'     //PAYJS 平台订单号
};
pay.close(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});

//撤销订单接口
//截至2019-03-28本猿测试时，找不到订单的时候会返回{} 请做好代码兼容
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
pay.reverse(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});

//退款接口
var params = {
  'payjs_order_id': ''     //PAYJS 平台订单号
};
pay.refund(params,function (msg) {
  console.log(msg);
  /**TODO 这里处理业务逻辑 */
});


//基于expressjs的回调示例
//异步通知，/notifyCheck为你的自定义回调地址
router.post('/notifyCheck', function(req, res, next) {
  var params=req.body;
  if(pay.notifyCheck(params)==true){ //签名校验成功
    if(params.return_code==1){
      //业务逻辑
      res.send('success');
    }else{
      res.status(404);
    }
  }else{
    //校验失败
    res.status(404);
  }
});