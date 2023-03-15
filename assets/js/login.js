$(function () {
  // 点击去注册按钮  隐藏登录 显示注册
  $("#goReg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 反之同理
  $("#goLogin").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  // 自定义用户密码校验规则
  layui.form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    // 自定义注册页面rename校验规则   要求两次密码一致且符合pass规则才能注册
    repass: function (value) {
      // 通过类、属性选择器拿到rename值
      let rename = $(".reg-box [name=password]").val();
      // 判断rename值是否与第一次密码输入的一致
      if (rename !== value) {
        return "两次密码输入不一致";
      }
    },
  });

  // 监听注册表单提交事件
  $("#form_reg").on("submit", function (e) {
    // 1. 阻止表单默认提交行为
    e.preventDefault();
    // 2. 发起AJAX的post提交
    let data = {
      username: $("#reguser").val(),
      password: $("#regpassword").val(),
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      } else {
        layer.msg("注册成功!");
        // 注册成功，就模拟人的点击行为  自动跳转登录界面
        $("#goLogin").click();
      }
    });
  });

  // 监听登录表单提交事件
  $("#form_login").submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      // serialize方法要求input输入框必须有id且 id要和接口文档保持一致
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          layer.msg("登录成功!");
          // 将请求成功之后的token值保存到      localStorage中   用于请求后面需要验证的接口(请求头部验证)
          // 语法localStorage.setItem('键',值);
          localStorage.setItem("token", res.token);
          // 跳转到后台页面
          // location.href = "/index.html";
        }
      },
    });
  });
});
