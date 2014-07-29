/**
 * @file 用户controller
 * @author r2space@gmail.com
 * @module user
 */

"use strict";

var user        = light.model.user
  , group       = light.model.group
  , auth        = light.model.auth
  , setting     = light.model.setting
  , error       = light.framework.error
  , log         = light.framework.log
  , check       = light.framework.validator
  , response    = light.framework.response
  , async       = light.util.async
  ;

/**
 * @desc 添加用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的用户
 */
exports.add = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: add user", uid);

  if (check.getFunc('isEmpty')(params.id)) {
    return callback(new error.parameter.ParamError("user id is required"));
  }

  if (check.getFunc('isEmpty')(params.password)) {
    return callback(new error.parameter.ParamError("password is required"));
  }

  if (params.email && !check.getFunc('isEmail')(params.email)) {
    return callback(new error.parameter.ParamError("email is invalid"));
  }

  // 加密
  params.password = auth.sha256(params.password);
  handler.addParams("schemaName", "User");
  user.add(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finished: add user", uid);
    return callback(err, result);
  });
};

/**
 * @desc 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的用户
 */
exports.remove = function(handler ,callback) {

  log.debug("begin: remove user", handler.uid);

  user.remove(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: remove user", handler.uid);

    return callback(err, result);
  });
};

/**
 * @desc 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新的用户
 */
exports.update = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: update user", uid);

  if (check.getFunc('isEmpty')(params.id)) {
    return callback(new error.parameter.ParamError("user id is required"));
  }

  if (params.email && !check.getFunc('isEmail')(params.email)) {
    return callback(new error.parameter.ParamError("email is invalid"));
  }

  //handler.addParams("appName", "FRStoreCommunications");
  handler.addParams("schemaName", "User");
  user.update(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finished: update user", uid);

    return callback(err, result);
  });
};

/**
 * @desc 获取指定用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回指定用户
 */
exports.get = function(handler ,callback) {

  log.debug("begin: get user", handler.uid);

  user.get(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: get user", handler.uid);

    return callback(err, result);
  });
};

/**
 * @desc 获取用户一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户一览
 */
exports.getList = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: getList user", uid);

  var condition = params.condition || {};
  condition.valid = 1;

  if (params.keyword) {
    condition.$or = [{ "uid": new RegExp(params.keyword.toLowerCase(), "i") }];
  }

  handler.addParams("condition", condition);
  handler.addParams("order", "-updateAt");

  user.getList(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finish: getList user", uid);

    return callback(err, result);
  });
};

/**
 * @desc Rest Password
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户
 */
exports.restPass = function(handler ,callback) {

  var params    = handler.params
    , uid       = handler.uid
    , userId    = params.userId
    , id        = params.id
    , oldPass   = params.oldPass
    , newPass   = params.newPass
    , conPass   = params.conPass;

  log.debug("begin: Rest Password", uid);

  if (!oldPass) {
    return callback(new error.parameter.ParamError("Please old Password."));
  }

  if (!newPass) {
    return callback(new error.parameter.ParamError("Please new Password."));
  }

  if (newPass !== conPass) {
    return callback(new error.parameter.ParamError("Password doesn't match the confirmation."));
  }

  handler.addParams("name", id);
  handler.addParams("password", auth.sha256(oldPass));
  user.isPasswordRight(handler, function (err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new error.parameter.ParamError("Old password isn't valid."));
    }

    if (result) {
      params.password = auth.sha256(newPass);
      params.uid = userId;
      params.id = result.id;
      user.update(handler, function(err, result) {

        if (err) {
          log.error(err, handler.uid);
          return callback(new error.parameter.ParamError("Rest Password is failed."));
        }

        delete result._doc.password; // 擦除密码
        log.debug("finished: Rest Password", uid);
        return callback(err, result);
      });
    } else {
      log.error(err, handler.uid);
      return callback(new error.parameter.ParamError("Old password isn't valid."));
    }
  });

};

/**
 * @desc Login
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.login = function(req, res) {

  auth.simpleLogin(req, res, function(err, result) {
    return response.send(res, err, result);
  });
};

/**
 * @desc Logout
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.logout = function(req, res) {

  auth.simpleLogout(req);
  return res.redirect("/site/login");
};

