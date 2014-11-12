/**
 * @file 对外接口定义
 * @author r2space@gmail.com
 */

"use strict";

var wechat = light.bridge.wechat
  ;

exports.dispatch = function(req, res) {

  console.log(req.body);
  wechat.reply(req, res);
};

exports.verify = function(req, res) {
  return wechat.verify(req, res);
};
