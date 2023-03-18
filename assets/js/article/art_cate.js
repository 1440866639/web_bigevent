$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArtCateList();
  // 封装一个初始化文章分类列表的函数
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        //   导入模板js后可直接调用函数,第一个参数为模板id  第二个是需要循环的数据
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  let index = null;

  // 添加类别点击事件
  $("#btnAddCate").on("click", function () {
    index = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加类别",
      //   注意： html()无参数是返回html内容   有参数是赋值
      content: $("#addCateContent").html(),
    });
  });

  // 因为添加类别的弹出框是动态添加的，所以我们不能用传统绑定事件的方法，这里用到代理，通过body代理到addCateForm身上
  $("body").on("submit", "#addCateForm", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $("#addCateForm").serialize(),
      success: function (res) {
        // console.log(res);
        // ... 出了点问题   "ER_DUP_ENTRY: Duplicate entry '2147483647' for key 'PRIMARY'"
        if (res.status !== 0) {
          // console.log(res);
          return layer.msg("添加分类失败");
        }
        initArtCateList();
        layer.msg("添加分类成功");
        //   成功就重新渲染分类页面
        layer.close(index);
      },
    });
  });

  let indexEdit = null;
  // 通过代理给编辑按钮添加点击事件
  $("tbody").on("click", "#editBtn", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      //   注意： html()无参数是返回html内容   有参数是赋值
      content: $("#editCateContent").html(),
    });

    let id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      data: id,
      success: function (res) {
        // console.log(res);
        form.val("editForm", res.data);
      },
    });
  });

  // 通过代理   为修改分类表单绑定submit事件
  $("body").on("submit", "#editCateForm", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          // 这里和发布文章的接口应该都挂了
          return layer.msg("更新信息失败");
        }
        layer.msg("更新信息成功");
        // 重新获取表格数据
        initArtCateList();
        // 自动关闭弹出层
        layer.close(indexEdit);
      },
    });
  });

  // 通过代理 为删除分类按钮绑定点击事件
  $("tbody").on("click", "#deleteBtn", function () {
    let id = $(this).attr("data-id");
    console.log(id);
    layer.confirm(
      "确认是否删除文章?",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          method: "GET",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除文章失败！");
            }
            layer.msg("删除文章成功！");
            initArtCateList();
            layer.close(index);
          },
        });
      }
    );
  });
});
