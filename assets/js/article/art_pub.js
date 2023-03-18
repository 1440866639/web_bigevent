$(function () {
  let layer = layui.layer;
  let form = layui.form;
  getClassify();
  // 定义一个获取分类的函数
  function getClassify() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取列表失败");
        }
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        //   重新渲染表单
        form.render();
      },
    });
  }
  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 为选择封面按钮绑定点击事件
  $("#chooseImg").on("click", function () {
    $("#hiddenInput").click();
  });

  // 为隐藏input绑定change事件
  $("#hiddenInput").on("change", function (e) {
    // 获取文件
    var files = e.target.files;
    // 判断文件长度是否为0  0则return
    if (files.length === 0) {
      return;
    }
    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0]);

    //   先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义变量保存发布状态
  var pub_state = "已发布";
  // 点击存为草稿 将状态改为 草稿
  $("#caoGao").on("click", function () {
    pub_state = "草稿";
  });
  // 为整个表单绑定submit事件
  $("#form_pub").on("submit", function (e) {
    //   1. 阻止默认提交事件
    e.preventDefault();
    // 2. 创建一个FormData对象    这里是用jquery方法拿到当前表单  转换为dom元素  使用了元素dom的方法
    var fd = new FormData($(this)[0]);
    // 3. 将pub_state存入fd中
    // append('保存值的键',需要保存的值)
    fd.append("state", pub_state);
    //  4. 测试  循环打印FormData的值
    fd.forEach((v, k) => {
      console.log(k, v);
    });
    // 将裁剪后的图片，输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //   5. 将文件追加到FormData对象中
        fd.append("cover_img", blob);
        //   6. 发起ajax请求 上传文章
        publishArticle(fd);
      });
  });

  // 封装上传文章的ajax函数
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 注意  发送FormData格式数据必须带的两个属性
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          console.log(res);
          return layer.msg("发布文章失败");
        }
        layer.msg("发布文章成功");
        //   因为文章列表接口有点问题，这里不进行跳转   ajax已经成功  列表获取不了
        // location.href = "/article/art_list.html";
      },
    });
  }
});
