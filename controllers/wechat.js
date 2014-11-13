/**
 * @file 对外接口定义
 * @author r2space@gmail.com
 */

"use strict";

var wechat = light.bridge.wechat;

/**
 * 响应回调模式下的企业号的请求
 * @param req
 * @param res
 */
exports.dispatch = function(req, res) {

  wechat.callback.reply(req, res, function(message, callback) {

    console.log(message);

    if (message.MsgType == "event") {
      return callback(null);
    }

    callback({
      fromUsername: message.ToUserName,
      toUsername: message.FromUserName,
      createTime: new Date().getTime(),
      msgType: "text",
      content: "你好，我们收到了你的消息！"
    });
  });
};

/**
 * 验证回调模式
 * @param req
 * @param res
 * @returns {*}
 */
exports.verify = function(req, res) {
  return wechat.callback.verify(req, res);
};
