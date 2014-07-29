
$(function () {
  "use strict";

  var self = this;
  self.file = undefined;
  self.tag = undefined;

  /**
   * 绑定事件
   */
  function events() {

    // 显示添加对话框
    $("#btnAdd").click(function() {
      $("#divAddShot").modal("show");
      return false;
    });

    // 保存
    $("#btnSave").click(function() {
      if (!isValid()) {
        return false;
      }

      light.dopost("/shot/add", getData(), function() {
        light.dopost("/tag/add", { data: {name: $("#txtTag").val().split(",")} }, function() {
          window.location = "/site/timeline";
        })
      });
      return false;
    });

    $("#divTagList").on("click", "a", function() {

      var original = self.tag
        , current  = $(this);

      if (!original) {
        self.tag = current;
        current.parent().addClass("label-active");
      } else {
        original.parent().removeClass("label-active");
        if (original.attr("tag") === current.attr("tag")) {
          self.tag = undefined;
        } else {
          current.parent().addClass("label-active");
          self.tag = current;
        }
      }

      find();
      return false;
    });

    $("#btnSearch").click(function() {
      find();
      return false;
    });
  }

  /**
   * 校验输入项目
   * @returns {boolean}
   */
  function isValid() {

    var title = $("#txtTitle").val(),
      message = $("#txtMessage").val();

    if (title.length <= 0) {
      alertify.error("请输入标题");
      return false;
    }

    if (message.length <= 0) {
      alertify.error("请输入消息");
      return false;
    }

    if (!self.file) {
      alertify.error("请选中图片");
      return false;
    }

    return true;
  }

  /**
   * 生成登陆数据
   * @returns {Object}
   */
  function getData() {
    return { data: {
      title: $("#txtTitle").val(),
      message: $("#txtMessage").val(),
      tag: $("#txtTag").val().split(","),
      image: self.file
    }};
  }

  /**
   * 生成画面
   */
  function render() {

    light.doget("/tag/list", {}, function(err, result) {
      var divTagList = $("#divTagList").html("")
        , tmplTag = $("#tmplTag").html();

      _.each(result.items, function(item) {
        divTagList.append(_.template(tmplTag, item));
      });
    });

    light.initFileuploadWithContainer("#divImage", "#divImage", {}
      , function(file) {
        self.file = file[0]._id;
      }
      , function() {
        alertify.error("照片上传失败");
      });

    find();
  }

  /**
   * 检索
   */
  function find() {

    var keyword = $("#txtKeyword").val()
      , params = self.tag ? { tag: self.tag.attr("tag") } : {};

    if (keyword) {
      params.title = "^" + keyword + ".*$";
    }

    light.doget("/shot/list", params, function(err, result) {
      var divImageList = $("#divImageList").html("")
        , tmplImageList = $("#tmplImageList").html();

      _.each(result.items, function(item) {
        item.tag = item.tag || [];
        divImageList.append(_.template(tmplImageList, item));
      });
    });
  }

  events();
  render();
});
