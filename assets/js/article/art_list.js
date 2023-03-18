$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义一个参数对象，用户请求数据
  let q = {
    pagenum: 1, // 页码值
    pagesize: 2, // 每页显示多少条数据
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的状态，可选值有：已发布、草稿
  };

  initTabble();
  initClassify();

  // 定义一个获取表格数据的方法
  function initTabble() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res); // 成功获取  但是没有值。。。
        if (res.status !== 0) {
          return layer.msg("获取表格信息失败");
        }
        // 成功拿到res  里面有一个total值  是我们计算分页页数的关键
        renderPage(res.total);
        let htmlStr = template("tpl-tab", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  // 定义时间格式化的方法
  template.defaults.imports.dataFormat = function (date) {
    let dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补0函数
  function padZero(n) {
    return n <= 9 ? "0" + n : n;
  }

  // 自定一个初始化文章分类的函数
  function initClassify() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败！");
        }
        let htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("#sel-cate").html(htmlStr);
        //   layui 更新渲染的方法
        form.render();
      },
    });
  }

  // 为筛选按钮绑定submit事件
  $(".layui-btn").on("submit", function (e) {
    e.preventDefault();
    // 把表单筛选的值赋值给q
    q.cate_id = $("#sel-cate").val();
    q.state = $("#sel-cate2").val();
    // 重新渲染表格
    initTabble();
  });

  // 定义一个渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // layui中laypage.render方法渲染页数
    laypage.render({
      elem: "pageBox", // 分页容器的id
      count: total, // 总数据数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 默认被选中的页面
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 调用jump回调函数有两种方法：
      // 方式1. 点击了页码值
      // 方式2. 通过laypage.render调用，(会发生死循环，需要判断first值防止)
      // jump回调函数被第一张方法调用时返回的是页码
      // 而被laypage.render调用返回值是true
      jump: function (obj, first) {
        // 通过回调拿到最新的页码值
        console.log(obj.curr);
        console.log(first);
        // 将最新的页码值 赋值 给q的页面值(因为我们是用q作为参数请求服务器的)
        q.pagenum = obj.curr;
        // 将最新的每条的页数obj.limit 赋值给q  列表会自动获取最新表格  因处于回调函数中
        q.pagesize = obj.limit;
        // 如果非true  就是方式1调用的，这个时候调用initTabble不会死循环
        if (!first) {
          initTabble();
        }
      },
    });
  }

  // 通过代理的方式给btn按钮绑定删除事件
  $(".body").on("click", "btn-delete", function () {
    // 通过自定义属性拿到当前按钮的id值   后面AJAX会用到
    let len = $(".btn-delete").length;
    let id = $(this).attr("data-id");
    // 弹出询问框
    layer.confirm(
      "确认是否删除?",
      { icon: 3, title: "提示" },
      function (index) {
        // 发送AJAX请求进行删除
        $.ajax({
          method: "GET",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除用户信息失败");
            }
            layer.msg("删除用户信息成功");
            // 这里我们应该判断当前页码数是否还含有数据  若为0，就把页码减一在刷新表格，否则执行表格刷新

            // 如果btn的len总数为1(len绑定的是删除事件里面的btn总数)     证明删完没有数据了   这时就该让页数减一再刷新表格了
            if (len == 1) {
              q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
            }
            // 刷新表格
            initTabble();

            // 关闭弹出层
            layer.close(index);
          },
        });
      }
    );
  });
});
