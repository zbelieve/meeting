//解决编辑器弹出层文本框不能输入的问题
$('#articleModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});
//KindEditor变量
var editor;
$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    initFlatPickr();

    //详情编辑器
    editor = KindEditor.create('textarea[id="editor"]', {
        items: ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'multiimage',
            'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink'],
        uploadJson: 'images/upload',
        filePostName: 'file'
    });

    $('#articleModal').on('hidden.bs.modal', function () {
        editor.html('请输入...');
    })

    $('#articleModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'articles/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, sortable: false, hidden: true, key: true},
            {label: '文献名', name: 'title', index: 'title', width: 150},
            {label: '作者', name: 'author', index: 'author', width: 80},
            {label: '期刊', name: 'source', index: 'source', width: 100},
            {label: '发表时间', name: 'publication', index: 'publication', width: 50},
            {label: '类型', name: 'type', index: 'type', width: 30}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50],
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: true,
        rownumWidth: 40,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "data.list",
            page: "data.currPage",
            total: "data.totalPage",
            records: "data.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order",
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});

/**
 * 搜索功能
 */
function search() {
    //标题关键字
    var keyword = $('#title').val();
    if (!validLength(keyword, 20)) {
        swal("搜索字段长度过大!", {
            icon: "error",
        });
        return false;
    }
    //开始时间、结束时间
    var startTimeStr = $('.startTime').val();
    var endTimeStr = $('.endTime').val();
    var startTime = new Date(startTimeStr.replace(/-/, "/"));
    var endTime = new Date(endTimeStr.replace(/-/, "/"));

    if (startTime >= endTime) {
        swal("开始时间不能大于结束时间!", {
            icon: "error"
        });
        return false;
    }
    var source = $('#source').val();
    var type = $('#sign').val();
    //数据封装
    var searchData = {keyword: keyword, startTime: startTimeStr, endTime: endTimeStr, source: source, type: type};

    //传入查询条件参数
    $("#jqGrid").jqGrid("setGridParam", {postData: searchData});
    //点击搜索按钮默认都从第一页开始
    $("#jqGrid").jqGrid("setGridParam", {page: 1});
    //提交post并刷新表格
    $("#jqGrid").jqGrid("setGridParam", {url: 'articles/search'}).trigger("reloadGrid");

}

/**
 * 初始化时间选择框
 */
function initFlatPickr() {
    $('.startTime').flatpickr();
    $('.endTime').flatpickr();
    //创建一个当前日期对象
    var now = new Date();
    //格式化日，如果小于9，前面补0
    var day = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    //小时
    var hour = ("0" + now.getHours()).slice(-2);
    //分钟
    var minute = ("0" + now.getMinutes()).slice(-2);
    //秒
    var seconds = ("0" + now.getSeconds()).slice(-2);
    //拼装完整日期格式
    var todayTime = now.getFullYear() + "-" + (month) + "-" + (day) + " 00:00:00";
    var nowTime = now.getFullYear() + "-" + (month) + "-" + (day) + " " + hour + ":" + minute + ":" + seconds;
    $('.startTime').val(todayTime);
    $('.endTime').val(nowTime);
}

/**
 * 查看内容
 */
function articleAbstrat() {
    reset();
    $('.modal-title').html('查看摘要');
    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    //请求abstrat数据
    $.get("articles/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#articleId').val(r.data.id);
            $('#articleName').val(r.data.title);
            $('#articleAuthor').val(r.data.author);
            editor.html('');
            editor.html(r.data.abstrat);
        }
    });
    $('#articleModal').modal('show');
}
function articleTxt() {
    reset();
    $('.modal-title').html('浏览文本');
    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    //请求txt数据
    $.get("articles/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#articleId').val(r.data.id);
            $('#articleName').val(r.data.title);
            $('#articleAuthor').val(r.data.author);
            editor.html('');
            editor.html(r.data.txt);
        }
    });
    //显示modal
    $('#articleModal').modal('show');
}
/**
 * 上传txt
 */
function uploadTxt() {
    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    //请求txt数据
    $.get("articles/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#uploadId').val(r.data.id);
            $('#uploadName').val(r.data.title);
            $('#uploadAuthor').val(r.data.author);
        }
    });
    $('#uploadModal').modal('show');
}

//绑定modal上的上传按钮
$('#uploadButton').click(function () {
    //验证数据
    if (validObject()) {
        //一切正常后发送网络请求
        //ajax
        var id = $("#uploadId").val();
        var file = document.getElementById("fileName").files;
        var fileName = file[0].name;
        var data = {"id": id, "file": fileName};
        var url = 'articles/upload';
        var method = 'PUT';
        $.ajax({
            type: method,//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: url,//url
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                //设置header值
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify(data),
            success: function (result) {
                checkResultCode(result.resultCode);
                if (result.resultCode == 200) {
                    $('#uploadModal').modal('hide');
                    swal("上传成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#uploadModal').modal('hide');
                    swal("上传失败", {
                        icon: "error",
                    });
                }
                ;
            },
            error: function () {
                swal("操作失败", {
                    icon: "error",
                });
            }
        });

    }
});

/**
 * 下载
 */
function download() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "确认要下载原文吗?",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            $.ajax({
                type: "PUT",
                url: "articles/download",
                contentType: "application/json",
                beforeSend: function (request) {
                    //设置header值
                    request.setRequestHeader("token", getCookie("token"));
                },
                data: JSON.stringify(ids),
                success: function (r) {
                    checkResultCode(r.resultCode);
                    if (r.resultCode == 200) {
                        swal("下载成功!", {
                            icon: "success",
                        });
                        $("#jqGrid").trigger("reloadGrid");
                    } else {
                        swal(r.message, {
                            icon: "error",
                        });
                    }
                }
            });
        }
    });
}

/**
 * 数据验证
 */
function validObject() {
    var articleName = $('#articleName').val();
    if (isNull(articleName)) {
        showErrorInfo("标题不能为空!");
        return false;
    }
    if (!validLength(articleName, 120)) {
        showErrorInfo("标题字符不能大于120!");
        return false;
    }
    var articleAuthor = $('#articleAuthor').val();
    if (isNull(articleAuthor)) {
        showErrorInfo("作者不能为空!");
        return false;
    }
    if (!validLength(articleAuthor, 100)) {
        showErrorInfo("作者字符不能大于100!");
        return false;
    }
    return true;
}

/**
 * 重置
 */
function reset() {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#articleId').val(0);
    $('#articleName').val('');
    $('#articleAuthor').val('');
    $('#ariticleContent').val('');
}
/**
 * 删除记录
 */
function deleteArticle() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            $.ajax({
                type: "DELETE",
                url: "articles/delete",
                contentType: "application/json",
                beforeSend: function (request) {
                    //设置header值
                    request.setRequestHeader("token", getCookie("token"));
                },
                data: JSON.stringify(ids),
                success: function (r) {
                    checkResultCode(r.resultCode);
                    if (r.resultCode == 200) {
                        swal("删除成功!", {
                            icon: "success",
                        });
                        $("#jqGrid").trigger("reloadGrid");
                    } else {
                        swal(r.message, {
                            icon: "error",
                        });
                    }
                }
            });
        }
    });
}

/**
 * jqGrid重新加载
 */
function reload() {
    reset();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}