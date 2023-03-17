$(function () {
  let layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 模拟点击input事件
  $("#uploadAvatar").on("click", function () {
    $("#file").click();
    // 实现裁剪区图片替换
    $("#file").on("change", function (e) {
      //   console.log(e);
      //   判断用户是否上传了图片
      if (e.target.files.length === 0) {
        layer.msg('"如需修改头像，请选择图片"');
      }
      // 拿到用户选择的图片
      let file = e.target.files[0];
      // 把选择的文件转换为url地址
      let imgURL = URL.createObjectURL(file);
      // 销毁旧区域   重新设置图片路径   之后创建新区域
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", imgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  });
  // 1. 拿到用户裁剪过后的头像
  $("#confirmUpload").on("click", function () {
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 2. 发起ajax请求
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更换头像失败");
        }
        layer.msg("更换头像成功");
        // 通过调用 index.js 父页面的方法重新渲染用户头像
        window.parent.getUserInfo();
      },
    });
  });
});
