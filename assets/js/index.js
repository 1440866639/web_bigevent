$(function () {
  getUserInfo();
});

// 封装一个获取用户信息的函数    因为页面一加载就得渲染出页面信息  所以写在入口函数外边
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // 必须带请求头  之前在login页面拿到的  保存在 localStorage 中
    // headers: { Authorization: localStorage.getItem("token") || "" },
    success: function (res) {
      // 如果失败 则提示服务器返回消息
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      } else {
        //   成功就渲染头像信息
        renderAvatar(res.data);
        //   实现退出功能
        $("#btnLogout").on("click", function () {
          layer.confirm(
            "确认是否退出账户?",
            { icon: 3, title: "提示" },
            function (index) {
              //do something
              // 1. 退出清空localStorage中的token请求头
              localStorage.removeItem("token");
              // 2. 跳转到登录页面
              location.href = "/login.html";
              layer.close(index);
            }
          );
        });
      }
    },
    // // complete 函数是无论ajax请求成功或者失败  都会执行的一个函数  可以用来防止用户直接从登录页进入我们主页
    // complete: function (res) {
    //   //   console.log(res);
    //   // 判断res返回值是否正确  若错误  则强制返回登录页
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     // 1. 清空token值
    //     localStorage.removeItem("token");
    //     // 2. 强制跳转到登录页
    //     location.href = "/login.html";
    //   }
    // },
  });
}
function renderAvatar(user) {
  // 定义变量保存用户的姓名信息
  let userinfo = user.nickname || user.username;
  // 渲染欢迎语
  $("#welcome").html("你好&nbsp;&nbsp;" + userinfo);
  // 渲染用户头像
  if (user.user_pic !== null) {
    // console.log("图片地址不为空时");
    $(".text-avatar").hide();
    $(".layui-nav-img").attr("src", user.user_pic).show();
  } else {
    // 否则就用文本头像
    //   定义变量 拿到用户名第一个字母 并通过 toUpperCase 转换为大写
    let first = userinfo[0].toUpperCase();
    //   隐藏图片头像
    $(".layui-nav-img").hide();
    //   显示文本头像
    $(".text-avatar").html(first).show();
  }
}
