$(function () {
    //隐藏弹框
    $('#DataSetModal').modal('hide');
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    //modal绑定hide事件
    $('#DataSetModal').on('hide.bs.modal', function () {
        reset();
    })
    $("#jqGrid").jqGrid({
        url: 'dataSets/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, sortable: false, hidden: true, key: true},
            {label: '数据集编号', name: 'dsid', index: 'dsid', sortable: false, width: 100},
            {label: '数据集名称', name: 'name', index: 'name', sortable: false, width: 100},
            {label: '备注', name: 'remark', index: 'remark', sortable: true, width: 100}
        ],
        height: 250,
        rowNum: 5,
        rowList: [5, 10, 15],
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: true,
        rownumWidth: 25,
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
            order: "order"
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

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
        //一切正常后发送网络请求
        //ajax
        var id = $("#Id").val();
        var dsid = $("#dsid").val();
        var name = $("#dsname").val();
        var remark = $("#dsremark").val();
        var data = {"dsid": dsid, "name": name,"remark":remark};
        var url = 'dataSets/save';
        var method = 'POST';
        //id>0表示编辑操作
        if (id > 0) {
            data = {"id": id,"dsid": dsid, "name": name,"remark":remark};
            url = 'dataSets/update';
            method = 'PUT';
        }
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
                    $('#DataSetModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#DataSetModal').modal('hide');
                    swal("保存失败", {
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
});

function DataSetAdd() {
    reset();
    $('.modal-title').html('新增数据集');
    $('#DataSetModal').modal('show');
}


function DataSetEdit() {
    reset();
    $('.modal-title').html('编辑数据集');
    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    //请求数据
    $.ajax({
        type: "GET",
        url: "dataSets/info/" + id,
        contentType: "application/json",
        beforeSend: function (request) {
            //设置header值
            request.setRequestHeader("token", getCookie("token"));
        },
        success: function (r) {
            checkResultCode(r.resultCode);
            if (r.resultCode == 200 && r.data != null) {
                //填充数据至modal
                $('#Id').val(r.data.id);
                $('#dsid').val(r.data.dsid);
                $('#dsname').val(r.data.name);
                $('#dsremark').val(r.data.remark);
            }
        }
    });
    //显示modal
    $('#DataSetModal').modal('show');
}
/**
 * 数据验证
 */
function validObject() {
    var picturePath = $('#picturePath').val();
    if (isNull(picturePath)) {
        showErrorInfo("图片不能为空!");
        return false;
    }
    var pictureRemark = $('#pictureRemark').val();
    if (isNull(pictureRemark)) {
        showErrorInfo("备注信息不能为空!");
        return false;
    }
    if (!validLength(pictureRemark, 150)) {
        showErrorInfo("备注信息长度不能大于150!");
        return false;
    }
    if (!validLength(picturePath, 120)) {
        showErrorInfo("图片上传有误!");
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
    $('#pictureId').val(0);
    $('#picturePath').val('');
    $('#pictureRemark').val('');
    $("#img").attr("style", "display:none;");
}

function deletePicture() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "确认弹框",
        text: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            $.ajax({
                type: "DELETE",
                url: "dataSets/delete",
                contentType: "application/json",
                beforeSend: function (request) {
                    //设置header值
                    request.setRequestHeader("token", getCookie("token"));
                },
                data: JSON.stringify(ids),
                success: function (r) {
                    checkResultCode(r.resultCode);
                    if (r.resultCode == 200) {
                        swal("删除成功", {
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
/**
 * DSjqGrid重新加载
 */
$(function () {
    $("#DSjqGrid").jqGrid({
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
        pager: "#DSjqGridPager",
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
            $("#DSjqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $(window).resize(function () {
        $("#DSjqGrid").setGridWidth($(".card-body").width());
    });
});
/**
 * DSjqGrid重新加载
 */
function DSreload() {
    reset();
    var page = $("#DSjqGrid").jqGrid('getGridParam', 'page');
    $("#DSjqGrid").DSjqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}