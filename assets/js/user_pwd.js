$(function () {
  let form = layui.form;
  // 表单验证
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    newpass: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新密码不能和旧密码一致！";
      }
    },
    repass: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次密码不一致！";
      }
    },
  });

  // 绑定提交事件  发起AJAX请求
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更改密码失败");
        }
        layui.layer.msg("更改密码成功");
        //  更改成功通过原生DOM方法重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
});
