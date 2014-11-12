/**
 * @file 对外接口定义
 * @author r2space@gmail.com
 */

"use strict";

var wechat = light.bridge.wechat;

exports.dispatch = function(req, res) {

  wechat.reply(req, res, function(message, callback) {
    console.log(message);
    callback({
      fromUsername: message.ToUserName,
      toUsername: message.FromUserName,
      createTime: new Date().getTime(),
      msgType: "text",
      content: "你好，我们收到了你的消息！"
    });
  });
};

exports.verify = function(req, res) {
  return wechat.verify(req, res);
};
