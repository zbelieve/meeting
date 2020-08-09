
var pdf_name=''; // pdf名字
var pdf_page='';//保存选择pdf页码
var chooseFileName='';

var w = document.getElementById("coordiv");
var scrollDistance ="0";
var biaoDiv= document.getElementById("biaoDiv");
w.onscroll = function (ev) {
    scrollDistance = w.scrollTop
};


function deleteImg() {
    var box = document.getElementById("Banner");
    box.innerHTML = "";
}
function SelectFiles() {
    var filepath = document.getElementById("importFile").value;
    // 这时的filename不是 importFile 框中的值
    var filename = filepath.split('\\');
    filename = filename[filename.length-1];
    filename =filename.split('.');
    var obj ={
        'filename':filename[0]
    };

    $.ajax({
        url: "/getFile",
        type:'post',
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
                deleteImg();
                var myParent = document.getElementById("Banner");
                for (var i = 0; i < result["pages"]; i++) {
                    var myImage = document.createElement("img");
                    myImage.src = '../pdfSourceAndImg/'+result["file"]+'/' +'img/'+ i + '.jpg';
                    myImage.id = filename[0]+'-'+i;;
                    myImage.width = 160;
                    myImage.height = 200;
                    myImage.addEventListener("click", function (ev) {
                        var div = document.getElementsByTagName('div');
                        var reg = new RegExp('^[0-9]+$');
                        for (var i =0; i<div.length;i++){
                            if (div[i].className =='box'){
                                div[i].remove();
                                i--;
                            }
                            if (reg.test(div[i].id)) {
                                div[i].remove();
                                i--;
                            }
                        }
                        // document.getElementById("coordiv").className = 'show';
                        document.getElementById("coordiv").innerHTML = '<img class="c_img" id="topImg"  draggable="false" src="' + this.src + '"">';
                    })
                    myParent.appendChild(myImage);
                    var div = document.createElement("div");
                    div.innerHTML = i+1;
                    div.style.textAlign = "center";
                    myParent.appendChild(div);
                    // myImage.style.marginLeft = "160px";
            }
        },
        error: function (result) {
        }
    })
}

function dealSelectFiles(){
    /// get select files.
    var selectFiles = document.getElementById("selectFiles").files;
    console.log(selectFiles);
    deleteImg();
    var myParent = document.getElementById("Banner");
    for(var i=0;i<selectFiles.length;i++){
        var myImage = document.createElement("img");
        console.log(selectFiles[i].webkitRelativePath)
        myImage.src = 'http://localhost:63342/http2/static/pdfSourceAndImg/'+selectFiles[i].webkitRelativePath+'/img';
        myImage.id = i;
        myImage.width = 160;
        myImage.height = 200;
        myImage.addEventListener("click", function (ev) {
            var div = document.getElementsByTagName('div');
            var reg = new RegExp('^[0-9]+$');
            for (var i =0; i<div.length;i++){
                if (div[i].className =='box'){
                    div[i].remove();
                    i--;
                }
                if (reg.test(div[i].id)) {
                    div[i].remove();
                    i--;
                }
            }
            document.getElementById("coordiv").className = 'show';
            document.getElementById("coordiv").innerHTML = '<img id="pdfImg" class="img_left"  ondragstart="return false;" src="' + this.src + '"">';
        })
        myParent.appendChild(myImage);
        var div = document.createElement("div");
        div.innerHTML = i+1;
        div.style.textAlign = "center";
        myParent.appendChild(div);
    }
}


var box_num=0;

//提交坐标
/*
*1.0版本
 */
function postData(e) {
    // scrollDistance = scrollDistance.toString();
    // if (scrollDistance.indexOf(".") !=-1){
    //     scrollDistance = scrollDistance.substring(0,scrollDistance.indexOf('.'))
    // }else {
    // }
    scrollDistance = 0;
    var imgId = document.getElementById("coordiv").getElementsByTagName("img");
    var src = imgId[0].src;
    var imgNum = src.split('/');
    if(chooseFileName==''){
        var package = imgNum[imgNum.length-3];//文件名
    }else {
        package = chooseFileName;
    }
    // console.log("img:"+imgNum);

    imgNum = imgNum[imgNum.length-1];
    imgNum =imgNum.split('.');
    // var data = JSON.stringify(jsonData);
    var jsonData = [];
    $('#rightContentbody tr').each(function (index) {
        var w = $(this).children('td').eq(0).html()
        var h = $(this).children('td').eq(1).html()
        var x = $(this).children('td').eq(2).html()
        var y = $(this).children('td').eq(3).html()
        var obj = {}
        obj.left_x = parseInt(x);
        obj.left_y = parseInt(y)
        obj.right_x = parseInt(x)+parseInt(w)
        obj.right_y = parseInt(y)+parseInt(h)
        jsonData.push(obj)
    });
    jsonData = JSON.stringify(jsonData);
    pageData = {
        'package' : package,
        'pageNum' : imgNum[0],
        'data' : jsonData,
        'scrollDistance':scrollDistance
    };
    pdf_name = package;
    pdf_page = imgNum[0];
    document.getElementById("pdf_name").value=pdf_name;
    document.getElementById("pdf_page").value=pdf_page;
    var data = JSON.stringify(pageData);

    jsonData = [];
    $.ajax({
        url: "/saveLoc",
        type:'post',
        data: data,
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var table_data = result;
            var json1 = [];
            for (var i=0;i<(table_data.length-1);i++){
                var s = table_data[i].split(" ");
                var params = new Object();
                if (true) {
                    for (var j=0;j<s.length;j++){
                        var name = "col"+j;
                        params[name] = s[j];
                    }
                    json1.push(params);
                }
            }
            var length = Object.keys(json1[0]).length;
            var columnsArray = [];
            var json=[];
            columnsArray.push({
                "field":"checked",
                'checkbox':true
            });
            columnsArray.push({
                'field': 'id',
                'title': '序号',//标题  可不加
                'visible':false,
                'formatter': function (value, row, index) {
                    return index + 1;
                }
            });
            for (var i=0;i<length;i++){
                var name = (Object.keys(json1[0]))[i];
                columnsArray.push({
                    "title": name,
                    "field":name,
                    switchable: true
                })
            }


            
            $('#extraction_table').bootstrapTable('destroy').bootstrapTable({
                data: json1,
                // toolbar: '#toolbar',
                clickEdit:true,
                sortName: "create_time",
                // sortOrder: "desc",
                pageSize: 100,
                pageNumber: 1,
                pageList: "[100,200]",
                // showToggle: true,
                // showRefresh: true,
                // showColumns: true,
                // search: true,
                clickToSelect: true,        //是否启用点击选中行
                pagination: true,
                columns: columnsArray,
            /**
             * @param {点击列的 field 名称} field
             * @param {点击列的 value 值} value
             * @param {点击列的整行数据} row
             * @param {td 元素} $element
             */
                onClickCell:function (field, value, row, $element) {
                $element.attr('contenteditable', true);
                $element.blur(function() {
                    var index = $element.parent().data('index');
                    var tdValue = $element.html();
                    saveData0(index, field, tdValue);
                })
                },
                onDblClickRow:function (row,$element) {
                    var i=$element.data('index');
                    $('#extraction_table').bootstrapTable('insertRow',{index:i+1,row:{newFlag:"1"}});
                }
            });
        },
        error: function (result) {
        }
    })
}

function deleteHang() {
    var row = $('#extraction_table').bootstrapTable('getSelections');
    if (row.length ==0){
        alert("请先选择要删除的记录!")
        return;
    }else {
        for (var i=0;i<row.length;i++){
            var a = row[i].col0;
            $('#extraction_table').bootstrapTable('remove',{
                field:'col0',
                values:[row[i].col0]
            })
        }

    }
}
function saveData0(index, field, value) {
    $('#extraction_table').bootstrapTable('updateCell', {
        index: index,       //行索引
        field: field,       //列名
        value: value        //cell值
    })
}
// window.operateEvents = {
//     'click #rowDel': function (e, value, row, index) {
//         var uid=$(this).parent().parent().attr("data-uniqueid");
//         $('#extraction_table').bootstrapTable('removeByUniqueId', uid);
//     }
// };



//结合tabula 和pdfplumber
// function postData(e) {
//     var imgId = document.getElementById("coordiv").getElementsByTagName("img");
//     var src = imgId[0].src;
//     var imgNum = src.split('/');
//     var package = imgNum[imgNum.length-3];//文件名
//     imgNum = imgNum[imgNum.length-1];
//     imgNum =imgNum.split('.');
//     var jsonData = [];
//     $('#rightContentbody tr').each(function (index) {
//         var w = $(this).children('td').eq(0).html()
//         var h = $(this).children('td').eq(1).html()
//         var x = $(this).children('td').eq(2).html()
//         var y = $(this).children('td').eq(3).html()
//         var obj = {}
//         obj.left_x = parseInt(x);
//         obj.left_y = parseInt(y)
//         obj.right_x = parseInt(x)+parseInt(w)
//         obj.right_y = parseInt(y)+parseInt(h)
//         jsonData.push(obj)
//     });
//     jsonData = JSON.stringify(jsonData);
//     pageData = {
//         'package' : package,
//         'pageNum' : imgNum[0],
//         'data' : jsonData,
//     };
//     var data = JSON.stringify(pageData);
//     jsonData = [];
//     $.ajax({
//         url: "/saveLoc",
//         type:'post',
//         data: data,
//         dataType: "json",
//         contentType: "application/json",
//         success: function (result) {
//             var table_body = document.getElementById("rightContentbody");
//             if (table_body !== "undefined") {
//                 while(table_body.hasChildNodes()){
//                     table_body .removeChild(table_body.lastChild)
//                 }
//             }
//             deleteTables();
//             console.log(result.toString());
//             var div = document.getElementById("info");
//             var create_div = document.createElement('div')
//             create_div.className = 'tables';
//             create_div.style.width = 100 +"%";
//             create_div.style.height = 60 + "%";
//             create_div.style.marginTop = 20+ "px";
//             var tableNum =1; // 记录表格数目
//             var event = document.createElement("event");
//             event.className = "event-1";
//             for (var a=0;a<result.length;a++){
//                 var data0 = result[a];
//                 var row = data0.length;
//                 console.log(data0[1]);
//                 var col = "";
//                 for (var i=0;i<row;i++){
//                     if (data0[i] =="event-next") {
//                         create_div.appendChild(event);
//                         var button = document.createElement("input");
//                         button.setAttribute("type","button");
//                         button.setAttribute("id",tableNum);
//                         button.setAttribute("value","保存");
//                         button.style.width= "50px";
//                         button.setAttribute("onclick","saveData(this.id)");
//                         create_div.appendChild(button);
//                         if (i ==(row-1)){
//                             tableNum = tableNum+1;
//                             event = document.createElement("event");
//                             event.className = "event-" + tableNum;
//                         }
//                     }else {
//                         var tr = document.createElement('tr');
//                         var col_value = data0[i].split(" ");
//                         var data=[];
//                         for (var j=0;j<col_value.length;j++){
//                             if (col_value[j] !="")
//                             {
//                                 data.push(col_value[j])
//                             }
//                         }
//                         col = data.length;
//                         for (var j=0;j<col;j++){
//                             var td = document.createElement('td');
//                             td.innerHTML = data[j];
//                             tr.appendChild(td);
//                         }
//                         event.appendChild(tr);
//                     }
//                 }
//
//             }
//             div.appendChild(create_div)
//         },
//         error: function (result) {
//         }
//     })
// }

function deleteTables() {
    var box = document.getElementsByClassName("tables");
    if (box[0] !=null) {
        box[0].parentNode.removeChild(box[0]);
    }

}

function saveTable() {
    var rows=$('#extraction_table').bootstrapTable('getData');
    var pdf_name = document.getElementById("pdf_name").value;
    var pdf_page = document.getElementById("pdf_page").value;
    var uuid = document.getElementById("file-uuid").value;
    var table_data=[];
    for (var i=0;i<rows.length;i++){
        table_data.push(rows[i]);
    }
    var table_name="";
    var json = {
        "uuid":uuid,
        "table_name":table_name,
        "pdf_name":pdf_name,
        "pdf_page":pdf_page,
        "data":table_data
    };

    $.ajax({
        type: 'post',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: '/saveTableData',//url
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json),
        success: function (result) {
            if (result.data == "ok") {
                swal({
                    title: "保存成功",
                    type: "success"
                });
            }
            else {
                swal({
                    title: "保存失败",
                    type: "error"
                });
            }
            ;
        },
        error: function () {
            swal({
                title: "保存失败",
                type: "error"
            });
        }
    });
}

function saveData(tableId) {
    var tableClass = "event-"+tableId;
    var table =document.getElementsByClassName(tableClass);
    var data = [];
    for(var i=0,rows=table[0].rows.length; i<rows; i++){
        var cells=table[0].rows[i].cells.length;
        for(var j=0; j<cells; j++){
            if(!data[i]){
                data[i] = new Array();
            }
            data[i][j] = table[0].rows[i].cells[j].innerHTML;
        }
    }
    var sendData = {
        "data":data
    }
    window.location.href="/saveExcel/"+tableId;
}

//选择服务器文件按钮
function choseFile() {
    var pageData={
        'a':"0"
    };
    $.ajax({
        url: "/choseFile",
        type:'post',
        data:JSON.stringify(pageData),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            // console.log(result["files"]);
            var filesPath = result["files"];
            filesPath = filesPath.replace("[","");
            filesPath = filesPath.replace("]","");
            filesPath = filesPath.split(",");
            var listFiles = document.getElementById("listFiles");
            listFiles.innerHTML = "";
            var mydata=[];

            for (var i=0;i<filesPath.length;i++) {
                if (navigator.platform=="Win32"){
                    var filename = filesPath[i].split('\\');
                }else {
                    var filename = filesPath[i].split('/');
                }
                filename = filename[filename.length-1];
                var box = document.createElement("input");
                box.type = 'checkbox';
                box.id = filename;
                box.value = filename;
                box.name = "direction";
                var label = document.createElement("label");
                label.for = filename;
                label.innerHTML = filename;
                listFiles.appendChild(box);
                listFiles.appendChild(label);
                var tt = document.createElement("br");
                listFiles.appendChild(tt);
            }
            console.log(mydata);
            $("#fileModal").modal('show');
        }
    })
}

function deleteImg() {
    var box = document.getElementById("Banner");
    box.innerHTML = "";
}

function closefile() {
    $.ajax({
        url: "/close",
        type:'post',
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var num = parseInt(result["num"]);
            var name = result["fileName"];
            deleteImg();
            var myParent = document.getElementById("Banner");
            document.getElementById("file-name").innerText = '[本地库]'+ name;
            document.getElementById("file-uuid").value ="";
            for(var i=0;i<num;i++){
                var myImage = document.createElement("img");
                myImage.src = '../../pdfSourceAndImg/'+name+'/img/'+i+".jpg";
                myImage.id = name+'-'+i;
                myImage.width = 160;
                myImage.height = 200;
                myImage.addEventListener("click", function (ev) {
                    $(document).ready(function () {
                        var img = new Image()
                        img.src = $('#topImg').attr('src')
                        img.onload = function () {
                            $("#topImg").height(img.height);
                            $("#topImg").width(img.width);
                            xli = deletePx($('#topImg').css('width')) / (img.width );
                            yli = deletePx($('#topImg').css('height')) / (img.height );
                            $(".biaoDiv").height(img.height);
                        }
                        layui.use('layer', function () {
                            layer = layui.layer;
                        })
                    });
                    var div = document.getElementsByTagName('div');
                    var reg = new RegExp('^[0-9]+$');
                    for (var i =0; i<div.length;i++){
                        if (div[i].className =='box'){
                            div[i].remove();
                            i--;
                        }
                        if (reg.test(div[i].id)) {
                            div[i].remove();
                            i--;
                        }
                    }
                    document.getElementById("coordiv").innerHTML = '<img class="c_img" id="topImg"  draggable="false" src="' + this.src + '"">'+
                        '<div class="biaoDiv"></div>';
                })
                myParent.appendChild(myImage);
                var div = document.createElement("div");
                div.innerHTML = i+1;
                div.style.textAlign = "center";
                myParent.appendChild(div);
            }

        }
    });

}

function confirmFile() {
    var files = document.getElementsByName("direction");
    var name ="";
    for (var i=0;i<files.length;i++){
        if (files[i].checked ==true){
            name = files[i].value;
        }
    }
    chooseFileName= name;
    var data ={
        "name":name
    };

    $.ajax({
        url: "/confirmFile",
        type:'post',
        data:JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var num = parseInt(result["num"]);
            deleteImg();
            var myParent = document.getElementById("Banner");
            // var path = "D:\\http2\\src\\main\\resources\\static\\pdfSourceAndImg\\"+name+"\\img";
            document.getElementById("file-name").innerText = '[本地库]'+ name;
            document.getElementById("file-uuid").value ="";
            for(var i=0;i<num;i++){
                var myImage = document.createElement("img");
                myImage.src = '../../pdfSourceAndImg/'+name+'/img/'+i+".jpg";
                myImage.id = name+'-'+i;
                myImage.width = 160;
                myImage.height = 200;
                myImage.addEventListener("click", function (ev) {
                    $(document).ready(function () {
                        var img = new Image()
                        img.src = $('#topImg').attr('src')
                        img.onload = function () {
                            $("#topImg").height(img.height);
                            $("#topImg").width(img.width);
                            xli = deletePx($('#topImg').css('width')) / (img.width );
                            yli = deletePx($('#topImg').css('height')) / (img.height );
                            $(".biaoDiv").height(img.height);
                        }
                        layui.use('layer', function () {
                            layer = layui.layer;
                        })
                    })
                    var div = document.getElementsByTagName('div');
                    var reg = new RegExp('^[0-9]+$');
                    for (var i =0; i<div.length;i++){
                        if (div[i].className =='box'){
                            div[i].remove();
                            i--;
                        }
                        if (reg.test(div[i].id)) {
                            div[i].remove();
                            i--;
                        }
                    }
                    // document.getElementById("coordiv").className = 'show';
                    document.getElementById("coordiv").innerHTML = '<img class="c_img" id="topImg"  draggable="false" src="' + this.src + '"">'+
                        '<div class="biaoDiv"></div>';
                })
                myParent.appendChild(myImage);
                var div = document.createElement("div");
                div.innerHTML = i+1;
                div.style.textAlign = "center";
                myParent.appendChild(div);
            }
        }
    })
}

//模态框显示库中pdf
function chooseKuData() {

    $.ajax({
        type: 'post',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/getAllPdf",//url
        contentType: "application/json; charset=utf-8",
        async: true, //同步请求，默认情况下是异步（true）
        beforeSend:function(){
            swal({
                title: "正在读取数据",
                type: "warning"
            });
        },
        success: function (result) {
            swal({
                title: "读取成功",
                type: "success"
            });
            $('#pdf-ku-table').bootstrapTable('destroy').bootstrapTable({
                data:result,
                // toolbar: '#toolbar',        //工具按钮用哪个容器
                striped: true,           //是否显示行间隔色
                cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,          //是否显示分页（*）
                sortable: false,           //是否启用排序
                // sortOrder: "asc",          //排序方式
                queryParams: "queryParams",//传递参数（*）
                sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
                pageNumber:1,            //初始化加载第一页，默认第一页
                pageSize: 50,            //每页的记录行数（*）
                pageList: [ 50, 100],    //可供选择的每页的行数（*）
                clickToSelect: true,        //是否启用点击选中行
                singleSelect:true,
                // search:true,
                height: 340,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "id",           //每一行的唯一标识，一般为主键列
                cardView: false,          //是否显示详细视图
                detailView: false,          //是否显示父子表
                columns: [{
                    field: "checkStatus",
                    title: "单选",
                    checkbox: true,
                    align: 'center'
                },
                    {
                        field: 'id',
                        title: '序号',
                        align: 'center',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    }, {
                        field: 'title',
                        title: '文件名',
                        align: 'center',
                        cellStyle:formatTableUnit,
                        formatter:paramsMatter
                    }, {
                        field: 'keyword',
                        title: '关键字',
                        align: 'center',
                        cellStyle:formatTableUnit,
                        formatter:paramsMatter
                    }],
            });
            $('#pdfDataModal').modal('show');
        }
    });

}
function paramsMatter(value,row,index) {
    var span=document.createElement('span');
    span.setAttribute('title',value);
    span.innerHTML = value;
    return span.outerHTML;
}

function formatTableUnit(value, row, index) {
    return {
        css: {
            "white-space": 'nowrap',
            "text-overflow": 'ellipsis',
            "overflow": 'hidden'
        }
    }
}

function confirm() {

    var row = $('#pdf-ku-table').bootstrapTable('getSelections');
    if(row[0] !=null){
        var uuid = row[0].UUID;
        $('#pdfDataModal').modal('hide');
    }else {
        swal({
            title: "至少选择一条数据",
            type: "error"
        });
    }
    var url = "/savePdf/"+uuid;
    $.ajax({
        url: url,
        type: 'post',
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var name = result["name"];
            var uuid = result["uuid"];
            var num = result["num"];
            deleteImg();
            var myParent = document.getElementById("Banner");
            document.getElementById("file-name").innerText = '[数据库]'+ name;
            document.getElementById("file-uuid").value = uuid;
            for(var i=0;i<num;i++){
                var myImage = document.createElement("img");
                myImage.src = '../../kuPdf/'+name+'/img/'+i+".jpg";
                myImage.id = name+'-'+i;
                myImage.width = 160;
                myImage.height = 200;
                myImage.addEventListener("click", function (ev) {
                    $(document).ready(function () {
                        var img = new Image()
                        img.src = $('#topImg').attr('src')
                        img.onload = function () {
                            $("#topImg").height(img.height);
                            $("#topImg").width(img.width);
                            xli = deletePx($('#topImg').css('width')) / (img.width );
                            yli = deletePx($('#topImg').css('height')) / (img.height );
                            $(".biaoDiv").height(img.height);
                        }
                        layui.use('layer', function () {
                            layer = layui.layer;
                        })
                    });
                    var div = document.getElementsByTagName('div');
                    var reg = new RegExp('^[0-9]+$');
                    for (var i =0; i<div.length;i++){
                        if (div[i].className =='box'){
                            div[i].remove();
                            i--;
                        }
                        if (reg.test(div[i].id)) {
                            div[i].remove();
                            i--;
                        }
                    }
                    document.getElementById("coordiv").innerHTML = '<img class="c_img" id="topImg"  draggable="false" src="' + this.src + '"">'+
                        '<div class="biaoDiv"></div>';
                })
                myParent.appendChild(myImage);
                var div = document.createElement("div");
                div.innerHTML = i+1;
                div.style.textAlign = "center";
                myParent.appendChild(div);
            }
        }
    });

    // window.location.href="/savePdf/"+uuid;

    // $.ajax({
    //     url: "/showKuPdf",
    //     type:'post',
    //     dataType: "json",
    //     contentType: "application/json",
    //     success: function (result) {
    //         var num = parseInt(result["num"]);
    //         var name = result[""];
    //         deleteImg();
    //         var myParent = document.getElementById("Banner");
    //         // var path = "D:\\http2\\src\\main\\resources\\static\\pdfSourceAndImg\\"+name+"\\img";
    //         document.getElementById("file-name").innerText = '[本地库]'+ name;
    //         for(var i=0;i<num;i++){
    //             var myImage = document.createElement("img");
    //             myImage.src = '../../pdfSourceAndImg/'+name+'/img/'+i+".jpg";
    //             myImage.id = name+'-'+i;
    //             myImage.width = 160;
    //             myImage.height = 200;
    //             myImage.addEventListener("click", function (ev) {
    //                 $(document).ready(function () {
    //                     var img = new Image()
    //                     img.src = $('#topImg').attr('src')
    //                     img.onload = function () {
    //                         $("#topImg").height(img.height);
    //                         $("#topImg").width(img.width);
    //                         xli = deletePx($('#topImg').css('width')) / (img.width );
    //                         yli = deletePx($('#topImg').css('height')) / (img.height );
    //                         $(".biaoDiv").height(img.height);
    //                     }
    //                     layui.use('layer', function () {
    //                         layer = layui.layer;
    //                     })
    //                 })
    //                 var div = document.getElementsByTagName('div');
    //                 var reg = new RegExp('^[0-9]+$');
    //                 for (var i =0; i<div.length;i++){
    //                     if (div[i].className =='box'){
    //                         div[i].remove();
    //                         i--;
    //                     }
    //                     if (reg.test(div[i].id)) {
    //                         div[i].remove();
    //                         i--;
    //                     }
    //                 }
    //                 // document.getElementById("coordiv").className = 'show';
    //                 document.getElementById("coordiv").innerHTML = '<img class="c_img" id="topImg"  draggable="false" src="' + this.src + '"">'+
    //                     '<div class="biaoDiv"></div>';
    //             })
    //             myParent.appendChild(myImage);
    //             var div = document.createElement("div");
    //             div.innerHTML = i+1;
    //             div.style.textAlign = "center";
    //             myParent.appendChild(div);
    //         }
    //     }
    // })
}

//保存到csv
function saveToCsv() {

    var allTableData = $('#extraction_table').bootstrapTable('getData');
    var jsonData = {
        "data":allTableData
    } ;
    $.ajax({
        url:'/saveToCSV',
        type:'post',
        data:JSON.stringify(jsonData),
        contentType : 'application/json;charset=utf-8', //设置请求头信息
        success:function(result){
            if (result.code =='200') {
                // var data = [];
                // for (var i=0; i<rows.length;i++){
                //     var json  = rows[i];
                //     data.push(json['id']);
                // }
                window.location.href="/saveTableToCsv";
            }
        },
        error:function () {

        }
    });
}

