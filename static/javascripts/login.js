
$(function () {
  "use strict";

  function events() {

    $("#signIn").bind("click", function(event){

      var username = $("#name").val()
        , password = $("#pass").val();


      if (username.length <= 0 || password.length <= 0) {
        alert("请输入用户名和密码。");
      } else {
        light.doget("/login", {name: username, password: password}, function(err, result) {
          if (err) {
            return alert("用户名或密码不正确，请从新输入。");
          }
          window.location = "/site/timeline";
        });
      }

      return false;
    });
  }

  // 注册事件
  events();
});
