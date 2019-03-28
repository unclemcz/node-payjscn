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


const toQueryString = (obj) => Object.keys(obj)
  .filter(key => key !== 'sign' && obj[key] !== undefined && obj[key] !== '')
  .sort()
  .map(key => {
    if (/^http(s)?:\/\//.test(obj[key])) { return key + '=' + encodeURI(obj[key]) } else { return key + '=' + obj[key] }
  })
  .join('&');

const md5 = (str, encoding = 'utf8') => crypto.createHash('md5').update(str, encoding).digest('hex');


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



function notifyCheck(params) {
  var originSign = params["sign"];
  delete params["sign"];
  return signature(params)["sign"] == originSign;
}


//测试


exports.native=native;//扫码支付
exports.micropay=micropay;//付款码支付
exports.notifyCheck=notifyCheck;//异步通知的数据校验
