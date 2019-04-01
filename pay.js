var crypto = require('crypto');
var cfg = require('./config.js');
var request = require('superagent');

var urlnative   = 'https://payjs.cn/api/native';
var urlmicropay = 'https://payjs.cn/api/micropay';
var urlcashier  = 'https://payjs.cn/api/cashier';
var urljsapi    = 'https://payjs.cn/api/jsapi';
var urlfacepay  = 'https://payjs.cn/api/facepay';
var urlcheck    = 'https://payjs.cn/api/check';
var urlclose    = 'https://payjs.cn/api/close';
var urlreverse  = 'https://payjs.cn/api/reverse';
var urlrefund   = 'https://payjs.cn/api/refund';
var urlopenid   = 'https://payjs.cn/api/openid';
var urluser     = 'https://payjs.cn/api/user';
var urlinfo     = 'https://payjs.cn/api/info';
var urlbank     = 'https://payjs.cn/api/bank';

var key = cfg.payjskey;


function toQueryString(obj) {
  return Object.keys(obj).filter(function(key) {
    return key !== 'sign' && obj[key] !== undefined && obj[key] !== '';
  }).sort().map(function(key) {
    if (/^http(s)?:\/\//.test(obj[key])) {
      return key + '=' + encodeURI(obj[key]);
    } else {
      return key + '=' + obj[key];
    }
  }).join('&');
};

function md5(str) {
  var encoding = arguments[1] !== (void 0) ? arguments[1] : 'utf8';
  return crypto.createHash('md5').update(str, encoding).digest('hex');
};


function signature(paramss) {
  var params = paramss;
  var strparams = toQueryString(params);  //签名第一步
  strparams += '&key=' + key; //签名第二步1
  const sign = md5(strparams).toUpperCase();//签名第二步2
  params['sign']=sign;
  return params;
}

//扫码支付（主扫）
function native(params,callback) {
  request.post(urlnative)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}

//付款码支付（被扫）
function micropay(params,callback) {
  request.post(urlmicropay)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}

//订单查询接口
function check(params,callback) {
  request.post(urlcheck)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}

//关闭订单接口
function close(params,callback) {
  request.post(urlclose)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}

//撤销订单接口
function reverse(params,callback) {
  request.post(urlreverse)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}

//退款接口
function refund(params,callback) {
  request.post(urlrefund)
  .send(signature(params))
  .end(function (err,res) {
    if(!err){
      callback(res.body);
    }else{
      console.log(err);
      callback({'return_code':0,'msg':'本地调用出错'});
    }
  });
}



//异步通知的签名校验
function notifyCheck(params) {
  var originSign = params["sign"];
  delete params["sign"];
  return signature(params)["sign"] == originSign;
}


exports.native=native;//扫码支付
exports.micropay=micropay;//付款码支付
exports.check=check;//订单查询接口
exports.close=close;//订单关闭接口
exports.reverse=reverse;//撤销订单接口
exports.refund=refund;//退款接口
exports.notifyCheck=notifyCheck;//异步通知的数据校验
