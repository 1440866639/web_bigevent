// 注意 我们每次使用$.ajax 或 $.get 或 $.post 时，都会先调用 $.ajaxPrefilter 这个函数
// 这个函数可以用来拼接我们请求url的路径， 请求的url = 根路径 + 不完整的接口路径
// 优点是 后期维护方便   修改一次  全局生效
$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3007" + options.url;
  //   console.log(options.url); http://www.liulongbin.top:3007/api/login
});
