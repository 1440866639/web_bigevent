$(function () {
  // 注意 调用form方法  一定要先定义form   遵守layui方法
  let form = layui.form;
  form.verify({
    nickname: function (value) {
      if (value.length <= 0 && value.length > 6) {
        return "用户的昵称在1 - 6位之间!";
      }
    },
  });
  initUserInfo();
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("请求用户信息失败");
        }
        // console.log(res);
        //   表单赋值   layui内置方法    第一参数是表单中的一个属性   第二个是拿到的数据对象集合
        form.val("formUserInfo", res.data);
      },
    });
  }
  // 重置按钮功能
  $("#btnReset").on("click", function (e) {
    //   阻止默认提交
    e.preventDefault();
    // 重新调用函数赋值
    initUserInfo();
  });
  // 用户信息提交事件
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("信息修改失败");
        }
        layui.layer.msg("信息修改成功");
        //   在子页面调用父页面更新信息的方法
        window.parent.getUserInfo();
      },
    });
  });
});
