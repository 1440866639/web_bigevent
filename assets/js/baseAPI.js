// 注意 我们每次使用$.ajax 或 $.get 或 $.post 时，都会先调用 $.ajaxPrefilter 这个函数
// 这个函数可以用来拼接我们请求url的路径， 请求的url = 根路径 + 不完整的接口路径
// 优点是 后期维护方便   修改一次  全局生效
$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3007" + options.url;
  //   console.log(options.url); http://www.liulongbin.top:3007/api/login

  // 统一为有权限的接口(api)  设置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 统一为 AJAX 挂在 compelte 函数
  options.complete = function (res) {
    //   console.log(res);
    // 判断res返回值是否正确  若错误  则强制返回登录页
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1. 清空token值
      localStorage.removeItem("token");
      // 2. 强制跳转到登录页
      location.href = "/login.html";
    }
  };
});
