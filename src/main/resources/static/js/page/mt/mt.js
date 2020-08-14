function select(){

    /*下面代码是获取url最后一位地址
    * */
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    //modal绑定hide事件
    $('#modalAdd').on('hide.bs.modal', function () {
        reset();
    })
    $('#modalEdit').on('hide.bs.modal', function () {
        reset();
    })

    $.jgrid.defaults.styleUI = 'Bootstrap';
    var url = "/meet/findAll/";
    $.get(url, function (data) {
        var meetingList=data.MeetingList;
        $('#meetingtable').bootstrapTable('destroy').bootstrapTable({
            data:meetingList,
            // toolbar: '#toolbar',        //工具按钮用哪个容器
            striped: true,           //是否显示行间隔色
            cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortOrder: "asc",          //排序方式
            queryParams: "queryParams",//传递参数（*）
            sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 20,            //每页的记录行数（*）
            pageList: [10, 25, 50, 100],    //可供选择的每页的行数（*）
            // clickToSelect: true,        //是否启用点击选中行
            // height: 200,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // width: 400,
            uniqueId: "m_uuid",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            columns: [{
                field: "checkStatus",
                title: "全选",
                checkbox: true,
                align: 'center'
            },{
                field: 'm_uuid',
                title: 'uuid',
                visible: false
            },
                {
                    field: 'm_name',
                    title: '信息标题',
                },
                {
                    field: 'm_content',
                    title: '信息概要',
                },{
                    field: 'm_person',
                    title: '信息分享人',
                },{
                    field: 'm_typeStr',
                    title: '信息分享会议类型'
                    ,
                },{
                    field: 'm_meetingid',
                    title: '会议id'
                    ,
                },{
                    field: 'm_meetingtime',
                    title: '会议时间'
                    ,
                },{
                    field: 'm_createtime',
                    title: '创建信息时间',
                },{
                    field: 'operator',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    width: '15%',
                    // visible: false,
                    //胡佳杰调整了三个标志间距
                    formatter: function (value, row, index) {
                        // var sid_code = base64encode(row.sid + '');   //  sid 加密处理
                        // alert(sid_code);
                        return '<a href="#">' +
                            '<a href="javascript:void(0)" title="显示" data-toggle="modal" data-target="#showModal" style="display: inline-block;margin-right: 25px;">' +
                            '<i class="glyphicon glyphicon-eye-open"></i> ' +
                            '<a href="#editProject" data-toggle="modal" title="修改" style="display: inline-block;margin-right: 25px;">' +
                            '<i class="glyphicon glyphicon-pencil"></i> ' +
                            '</a>'+
                            '<a href="javascript:void(0)" title="删除">' +
                            '<i class="glyphicon glyphicon-trash text-danger"></i> ' +
                            '</a>';
                    },

                    events: {

                    'click a[title=显示]': function (e, value, row, index) {
                        // e.preventDefault();
                        var rows=$("#meetingtable").bootstrapTable("getData")[index];
                        alert(JSON.stringify(rows))
                        alert('click change button');
                    },
                        
                        'click a[title=显示]': function (e, value, row, index) {
                            var rows=$("#meetingtable").bootstrapTable("getData")[index];
                            //alert(JSON.stringify(rows))
                            //显示在模态框内
                            //张梦倩
                            document.getElementById("zmodal_m_name").value = rows.m_name;
                            document.getElementById("zmodal_m_content").value = rows.m_content;
                            document.getElementById("zmodal_m_person").value = rows.m_person;
                            document.getElementById("zmodal_m_typeStr").value = rows.m_typeStr;
                            document.getElementById("zmodal_m_meetingid").value = rows.m_meetingid;
                            document.getElementById("zmodal_m_meetingurl").value = rows.m_meetingurl;
                            document.getElementById("zmodal_m_details").value = rows.m_details;
                            document.getElementById('zmodal_m_meetingtime').value = rows.m_meetingtime;
                            document.getElementById("zmodal_m_createtime").value = rows.m_createtime;
                        },
                        //姜若鹏
                        'click a[title=删除]': function (e, value, row, index) {
                            var rows=$("#meetingtable").bootstrapTable("getData")[index];
                            var m_uuid = rows.m_uuid;
                            if(confirm('此操作不可逆，请确认是否删除？')){
                                jQuery.ajax({
                                    url : "/meet/deleteOne",
                                    dataType : 'json',
                                    data:{"m_uuid":m_uuid},
                                    contentType : "application/x-www-form-urlencoded; charset=utf-8",
                                    type : "post",
                                    success : function(data){
                                        if(data=="1"){
                                            alert("删除成功！");
                                            location.reload();//刷新表单
                                        }

                                    }

                                });
                            }
                        },
                        'click a[title=修改]': function (e, value, row, index) {
                            // e.preventDefault();
                            var rows=$("#meetingtable").bootstrapTable("getData")[index];
                            $("#Modal-tp").modal('show')
                            document.getElementById("modal_m_uuid").value = rows.m_uuid;
                            document.getElementById("modal_m_name").value = rows.m_name;
                            document.getElementById("modal_m_content").value = rows.m_content;
                            document.getElementById("modal_m_person").value = rows.m_person;
                            $("#modal_m_typeStr").val(rows.m_type)
                            document.getElementById("modal_m_meetingUrl").value = JSON.parse(JSON.stringify(rows))['m_meetingurl'];
                            document.getElementById("modal_m_meetingDetails").value = JSON.parse(JSON.stringify(rows))['m_details'];
                            document.getElementById("modal_m_meetingId").value = rows.m_meetingid;
                            document.getElementById("modal_m_meetingTime").value = rows.m_meetingtime;
                            document.getElementById("modal_m_createTime").value = rows.m_createtime;
                            // alert(JSON.stringify(rows))
                            // alert('click change button');
                        }
                    }
                }

            ],


        });

    });

}

$("#buttonadd").click(function(){
    $("#Modal-tp-add").modal('show')
    $("#sava-add-btn").on("click", function() {

        data = {
            m_uuid : document.getElementById("modal_m_uuid_add").value,
            m_name : document.getElementById("modal_m_name_add").value,
            m_content : document.getElementById("modal_m_content_add").value,
            m_person : document.getElementById("modal_m_person_add").value,
            m_type : $('#modal_m_typeStr_add option:selected').val(),
            m_typeStr : $('#modal_m_typeStr_add option:selected').text(),
            m_meetingurl : document.getElementById("modal_m_meetingUrl_add").value,
            m_details: document.getElementById("modal_m_meetingDetails_add").value,
            m_meetingid : document.getElementById("modal_m_meetingId_add").value,
            m_meetingtime : document.getElementById("modal_m_meetingTime_add").value,
            m_createtime : document.getElementById("modal_m_createTime_add").value
        }
        $.ajax({
            type : "POST",
            url : "/meet/addInfo",
            data : data,
            success : function(data) {

                alert('添加成功！');

                location.reload();
                // document.execCommand('Refresh');
            },
            error : function() {
                alert('添加失败！');

            }
        });
    });
})

$("#buttondel").click(function(){
    var getSelectRows = $("#meetingtable").bootstrapTable('getSelections', function (row) {
                return row;
    });
    var listdata = ""

    for(var i=0,l=getSelectRows.length;i<l;i++){
        listdata=getSelectRows[i]["m_uuid"]+" "+listdata
    }

    var m_uuid = listdata;
    if(confirm('此操作不可逆，请确认是否删除？')){
        jQuery.ajax({
            url : "/meet/delInfos",
            dataType : 'json',
            data:{"m_uuid":m_uuid},
            contentType : "application/x-www-form-urlencoded; charset=utf-8",
            type : "post",
            success : function(data){
                if(data=="1"){
                    alert("删除成功！");
                    location.reload();//刷新表单
                }else{
                    alert("删除失败！");
                }

            }

        });
    }



})

//陶鹏
$("#sava-edit-btn").on("click", function() {
    data = {
        m_uuid : document.getElementById("modal_m_uuid").value,
        m_name : document.getElementById("modal_m_name").value,
        m_content : document.getElementById("modal_m_content").value,
        m_person : document.getElementById("modal_m_person").value,
        m_type : $('#modal_m_typeStr option:selected').val(),
        m_typeStr : $('#modal_m_typeStr option:selected').text(),
        m_meetingurl : document.getElementById("modal_m_meetingUrl").value,
        m_details: document.getElementById("modal_m_meetingDetails").value,
        m_meetingid : document.getElementById("modal_m_meetingId").value,
        m_meetingtime : document.getElementById("modal_m_meetingTime").value,
        m_createtime : document.getElementById("modal_m_createTime").value
    }
    $.ajax({
        type : "POST",
        url : "/meet/editInfo",
        data : data,
        success : function(data) {
            //showConfirm("success","执行成功！",false,false);
            //swal("","修改成功","success");
            alert('修改成功！');

            location.reload();
            // document.execCommand('Refresh');
        },
        error : function() {
            alert('修改失败！');

        }
    });
});
//datetimepicker设置。陶鹏
$("input[name='timeSet']").datetimepicker({
    minView : "day", //  选择时间时，最小可以选择到那层；默认是‘hour’也可用0表示
    language : 'zh-CN', // 语言
    autoclose : true, //  true:选择时间后窗口自动关闭
    format : 'yyyy-mm-dd hh:00:00', // 文本框时间格式，设置为0
    todayBtn : true, // 如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "Today" 按钮用以选择当前日期。
})