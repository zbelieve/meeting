//***********************************************************
//       复杂查询
//***********************************************************

////////////////////////////////////////////////////////////
/*
  var config1 = {value:'xx', text:'中文', datatype:'dict', ui:{type:'droplist'}, options:{list:[{code:'xxx1',text:'xxx1'},{code:'xxx2',text:'xxx2'}]}};
  var config2 = {value:'xx2', text:'中文2', datatype:'string', ui:{type:'input'}, options:{list:[{code:'xxx1',text:'xxx1'},{code:'xxx2',text:'xxx2'}]}};
  var criConfig = [config1, config2];
  var columnWidth = {'index':40, 'field':90, 'operator':90, 'operand':120, 'del':15};
  
  p = {};
  p.criConfig = criConfig;
  p.columnWidth = columnWidth;
*/

/*
	new CriItem("#cid", p);
	
	目前提供 number,string,dict(droplist),date,datetime支持.
*/
function CriItem(id, p){
	this.criConfig = p.criConfig;
	this.m_ColumnWidth = p.columnWidth; //各列的宽度
	this.m_index = p.index;
	this.container = null;
	this.TR = {}; //指向该条件项所在的TR
	this.TR.f = null;
	this.TR.o = null;
	this.TR.v = null;
	this.m_eventProcessor = {'ondblclick':null, 'onchange':null, 'onbeforedelete':null, 'onafterdelete':null, 'onerror':null};
	
	
	if (id=="" || id==null)	//如果没有传递容器的id,则自己创建一个div		
		this.container = $("<DIV></DIV>")[0];
	else
		this.container = $(id)[0]; 
	
	$(this.container).css("width", "100%");
	$(this.container).css("height", "100%");

	this.attachEvent = function(eventName, processor){
		this.m_eventProcessor[eventName] = processor;
	};
}

//提供tr编号,在一个页面中trid是唯一的.
CriItem.trid = 0;

CriItem.prototype.getIndex = function(){return this.m_index; };

	/*
	重新设置条件项的序号，需要修改内部的成员值以及修改界面显示的序号.
	*/
CriItem.prototype.setIndex = function(index){
	this.m_index = index;
	var text = document.createTextNode(this.m_index);
	$(this.TR.children[0]).empty();
	$(this.TR.children[0]).append(text);
};
	
CriItem.prototype.getContainer = function(){
	return this.container;
};
	
//创建界面
CriItem.prototype.create = function(){
		var CriterialItemself_201506141345 = this;

		var trid = CriItem.trid++;//UUID.create();
		var innerHTML = "<table style='width:100%;height:100%;font-size:12px;border:1'><tr style='width:100%;height:100%' ><td style='width:{0}px;user-select:none'></td><td style='width:{1}px'></td><td style='width:{2}px'></td><td  style='width:{3}px'></td><td  title='删除条件项' onmouseover=\" $(this.parentNode).css('background-color','#ff0000'); $(this).css({'color':'#ff0000','cursor':'hand'}); \" onmouseout=\"$(this).css('color', '#000000'); $(this.parentNode).css('background-color','#ffff00');\" style='width:{4}px;text-align:center;cursor:hand;user-select:none'>×</td></table>";
		
		innerHTML = innerHTML.format(this.m_ColumnWidth.xh, this.m_ColumnWidth.field, this.m_ColumnWidth.operator, this.m_ColumnWidth.operand,this.m_ColumnWidth.del);
		
		this.container.innerHTML = innerHTML;
		//TABLE下第一个子元素为TBODY
		//alert(this.container.children[0].children[0].children[0].tagName);
		//                         table         tbody      tr
		//this.TR = this.container.children[0].children[0].children[0];
		//虽然没有写出来TBODY，但是因为TR必然在TBODY中，因此系统自动增加.
		
		this.TR = $(this.container).find("TR")[0];
		
		//处理删除条件项的小按钮
		var delCtrl = this.TR.children[4];
		$(delCtrl).bind("click", function(){
			var f = CriterialItemself_201506141345.m_eventProcessor['onbeforedelete'];
			if (f!=null && typeof(f)!='undefined'){
				f(CriterialItemself_201506141345.m_index, CriterialItemself_201506141345);
			}	
		});

		//处理条件字段列表
		var f = FJS.DropList.create("", this.criConfig);
		$(f).css("width", "100%");
		//ElementHelper.setAttribute(f, "class", "cqfield");
		
		$(this.TR.children[1]).append(f);
		//this.TR.children[1].appendChild(f);
		this.TR.f = f;
		//this.fieldCtrl = f;
		var o = null;
		var v = null;
		  
		//var CriterialItemself_201506141345 = this; 
		//处理序号
		var text;
		text = document.createTextNode(this.m_index);
		//alert(text.tagName);
		//alert(this.m_index);
		//$(text).innerHTML = this.m_index;
		//$(text).css("width", "100%");
		//$(this.TR.children[0]).innerHTML = this.m_index;
		var xhObj = this.TR.children[0];
		$(xhObj).css("align", "center");
		$(xhObj).append(text);
		
		//针对第一个字段属性进行处理
		var p0 = this.criConfig[0];
		//创建操作符列表以及可选值列表
		this.createOpretorANDOperandUI(p0);
		//字段选择列表发生变化相应事件
		this.TR.f.onchange = function(){
								fvalue = this.value; 
								selectedIndex = this.selectedIndex;
								
								//获取选择字段的配置信息
								var pr = CriterialItemself_201506141345.criConfig[selectedIndex];

								CriterialItemself_201506141345.createOpretorANDOperandUI(pr);
					    	};
	
};

//在tr中创建条件项，条件项的属性由p指定
CriItem.prototype.createOpretorANDOperandUI = function(p){
		//alert('33');
		var CriterialItemself_201506141345 = this;
		var datatype = p.datatype;
		var ui = p.operand.ui;

		//根据数据类型重新生成操作符的列表 SELECT
		//创建操作符列表
		var operator = null;
		  
		//针对字典选项，若从树节点中选择，可以拥有不同的操作
		operator = FJS.DBMS.SQLOperator[datatype];
		  
		if (operator==null && typeof(operator)=='undefined'){
		    alert("CriItem 获取数据类型对应操作时发现错误的数据类型：" + datatype);
		    return;
		}

		//删除已有的Operator列表
		$(this.TR.children[2]).empty();
		
		var o = FJS.DropList.create("", operator);
		$(o).css("width", "100%");
		$(this.TR.children[2]).append(o);

		this.TR.o = o;
		//o.onchange = function(){
		//					var f = CriterialItemself_201506141345.m_eventProcessor["onchange"];
		//					if (f!=null)
		//						f(CriterialItemself_201506141345.m_index, CriterialItemself_201506141345);
		//			 };
		 
		//删除已有的值列表
		$(this.TR.children[3]).empty();
		
		var v = null;
		this.TR.v = null;
		this.TR.v2 = null;
		
		if (datatype=="string" || datatype=="number"){
			v = $("<INPUT />")[0];
			$(v).css("width", (this.m_ColumnWidth.operand-5)+"px");
			$(this.TR.children[3]).append(v);
			//v.onkeydown =  function(){cqself_0701.buildSQLCondition();};
			
		}else if (datatype=='date'){
			//需要设置关联时间窗体的代码格式为：YYYY-MM-DD
			v = $("<input class=\"upstartTime\" data-enable-time=\"true\" data-enable-seconds=\"true\" placeholder=\"选择时间\" style=\"width: 100px;background-color: white\">");
			$(v).css("width", (this.m_ColumnWidth.operand-5)+"px");
			$(this.TR.children[3]).append(v);
			initFlatPickr();
		}else if(datatype=='datetime'){
			//需要设置关联时间窗体的代码格式为：YYYY-MM-DD hh:mm:ss
			v = $("<INPUT />")[0];
			$(v).css("width", (this.m_ColumnWidth.operand-5)+"px");
			$(this.TR.children[3]).append(v);
			
		}else if (datatype.indexOf("dict_")>=0){
			if (ui.type=="droplist"){//如果为droplist方式，则配置信息提供list列表
				//alert(property.dictable.length);
				v = FJS.DropList.create("", p.operand.list);
				$(v).css("width", (this.m_ColumnWidth.operand-2)+"px");
				$(this.TR.children[3]).append(v);
				
			}else if (ui.type=="tree"){ //多级字典

			  
			}else if (ui.type=="grid"){ //表格
				var ds = p.operand.ds;
				//var inputctrl = property.inputctrl;
				//实际值隐藏
				v = $("<INPUT type='hidden'  />")[0];
				
				//显示出来的值 :name
				var v2 = $("<INPUT type='text'/>")[0];
				//ElementHelper.setAttribute(v2, "type", "text");
				$(v2).css("width", (this.m_ColumnWidth.operand-33) + "px");
				
				var b = $("<INPUT type='button' value='...'/>")[0];
				$(b).css("width", "25px");
				this.TR.children[3].appendChild(v);
				this.TR.children[3].appendChild(v2);
				this.TR.children[3].appendChild(b);
				
				//b.inputctrlObj = inputctrlObj;
				b.p = p;
				b.v2 = v2;
				b.v = v;
				this.TR.v2 = v2;
			  
				//设置b的事件
				$(b).bind("click", function(){

					var op = $(CriterialItemself_201506141345.TR.o).val(); 
					//if (this.dictable!=null && this.dictable!="") 
					//	inputctrlObj.data.dbtable = this.dictable;
				
					var multiselect = p.ui.multiselect;
					
					//var p = BrowserParameter.encode('title', this.inputctrlObj.ui.apptitle);
					var rtvl = window.showModalDialog(WebClient.urlRoot + '/pages/common/selectDictByGrid.jsp?'+p, this.p, 'dialogWidth=450px;dialogHeight=400px;status=no');
					if (rtvl==null || typeof(rtvl)=='undefined') return;

					if (rtvl.code=='200'){
						var dictList = rtvl.content.dictList;
						if (dictList.length<=0) return; //如果没有选择对象，则直接
						//alert(objList.length);
						var nameArray = new Array();
						var valueArray = new Array();
						for(var index=0; index<objList.length; index++){
							nameArray.push(objList[index].name);
							valueArray.push(objList[index].code);
						}
						b.v2.value = nameArray.join(",");
						b.v.value = valueArray.join(",");
						//b.v2.onchange();
					}	
				});	
			}
		}
		this.TR.v = v;
};

	//设置条件的各组合项,包括字段名,操作符以及值
	//c.field  .name  .value
	//c.operator .name  .value
	//c.operand  .value value2
CriItem.prototype.setCondition = function(c){
		
		$(this.TR.f).val(c.field.value);
		//var fSelectedIndex = $(f).get(0).selectedIndex;
		this.TR.f.onchange();
		
		
		$(this.TR.o).val(c.operator.value);
		$(this.TR.v).val(c.operand.value);
		
		if ((this.TR.v2!=null) && typeof(this.TR.v2)!='undefined'){
			$(this.TR.v2).val(c.operand.value2);
		}
};
	
	//返回条件的各组合项,包括字段名,操作符以及值
	//c.field  .name  .value
	//c.operator .name  .value
	//c.operand  .value value2
CriItem.prototype.getCondition = function(){
		var c = {};
		var field = {};
		var f = this.TR.f;
		field.value = $(f).val();
		field.name = $(f).find("option:selected").text();
		c.fSelectedIndex = $(f).get(0).selectedIndex;
		
		var o = this.TR.o;
		var operator = {};
		operator.value = $(o).val();
		operator.name = $(o).find("option:selected").text();	
		
		var operand = {};
		operand.value = $(this.TR.v).val();
		if (this.TR.v2!=null && typeof(this.TR.v2) !='undefined'){
			operand.value2 = $(this.TR.v2).val();
		}
		
		c.field = field;
		c.operator = operator;
		c.operand = operand;
		
		return c;
};
	
//返回组合后的条件
CriItem.prototype.getSQLCondition = function(){
		var c = this.getCondition();

		var criConfig = this.criConfig[c.fSelectedIndex];
		var datatype = criConfig.datatype;
		var op = c.operator.value;
		var opvalue = c.operand.value;
		
		if (datatype.indexOf("number")>=0) //dict_number
			datatype = "number";
		else if (datatype.indexOf("string")>=0) //dict_string
			datatype = "string";			
		
		//如果是日期类型，需要先装换成to_date等格式，然后放到SQL中
		if (datatype=='date'){
			opvalue = FJS.DBMS.toDateTime(opvalue, "YYYY-MM-DD");
			datatype = "number";
			//item = DBMS.SQLConditionBuild(op, opvalue, "");
		}else if (datatype=="datetime"){
			opvalue = FJS.DBMS.toDateTime(opvalue, "YYYY-MM-DD hh:mm:ss");
			datatype = "number";
		}

		var item = FJS.DBMS.SQLConditionBuilder.build(datatype, op, opvalue);
		
		if (item=='')
			item = "1=1";
		else
			item = c.field.value + " " + item;

		return item;
};

function CQWindow(id, criConfig){
	this.container = $(id)[0];

	$(this.container).css("width", "100%");
	$(this.container).css("height", "100%");
	$(this.container).css("font-size","15px");
	
	this.containerSize = this.getSize(this.container);//size;

	this.m_TRHeight = 25;
	this.m_zjButtonHeight = 25;
	this.m_cItemHeaderHeight = 22;
	this.m_logicButtonHeight = 25;
	this.m_exprContainerHeight = 25;
	this.m_conditionContainerHeight = 0;
	
	this.m_criConfig = criConfig;
	
	this.m_columnNumber = 3; //列数
	//this.m_maxRows = 10;
	this.cItemCtrlArray = new Array();
	
	//整体结构
	/*
	<DIV  container>
		<div zjtoolbar></div>
		<div sep></div>
		<div cItemContainerDIV>
			<div cItemtheaderDIV></div>
			<div cItemContentDIV> </div>
		</div>
	</DIV>
	*/
	
	this.cItemContainerDIV = null; //逐项条件的DIV标签容器
	this.cItemContainerTABLE = null;

	this.cItemContentTABLE = null;
	this.cItemContentTBODY = null;	
	
	this.exprContainer = null;
	this.exprContainerTXT = null;
	this.conditionStrContainer = null;
	this.m_ColumnWidth = {'index':45, 'field':90, 'operator':90, 'operand':120, 'del':25};
	this.m_cItemWidth = this.m_ColumnWidth.index + this.m_ColumnWidth.field + this.m_ColumnWidth.operator + this.m_ColumnWidth.operand+this.m_ColumnWidth.del;
	
	this.zhfsName = "AND_OR"+new Date().valueOf();
	this.zhfsId = this.zhfsName + "_ID";
	
	//$(this.container).resize(this.onCItemChange.bind(this));
};



//创建图形界面
CQWindow.prototype.init = function(){

	var cqself_0701 = this;
	
	////增减工具条 + - --  
	var zjtoolbar = document.createElement("DIV"); 
	this.container.appendChild(zjtoolbar);
	
	//ElementHelper.setAttribute(zjtoolbar, "style", "width:100%;height:"+this.m_zjButtonHeight+"px;background:#f5f5f5");
	$(zjtoolbar).css("width","100%");
	$(zjtoolbar).css("height", this.m_zjButtonHeight+"px");
	$(zjtoolbar).css("background", "#f5f5f5");
	
	var errorId = String.uuid();
	//innerHTML中不好写调用成员函数
	zjtoolbar.innerHTML = "<INPUT TYPE='BUTTON' style='margin-top:2px' VALUE='+'/><INPUT TYPE='BUTTON' VALUE='-'/>&nbsp;&nbsp;&nbsp;<INPUT TYPE='BUTTON' VALUE='- -'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;组合方式:<label><INPUT TYPE=RADIO NAME='"+this.zhfsName+"' ID='"+this.zhfsId+"_AND' value='AND' checked />与</label>&nbsp;&nbsp;<label><INPUT TYPE=RADIO NAME='"+this.zhfsName+"' ID='"+this.zhfsId+"_OR' VALUE='OR' />或</labe> <div id='"+errorId+"' style='float:right;color:#ff0000;margin-top:4px'></div>";
	zjtoolbar.children[0].onclick = function(){cqself_0701.addCriItem();}
	zjtoolbar.children[1].onclick = function(){if (cqself_0701.cItemCtrlArray.length>0) cqself_0701.deleteCriItem(cqself_0701.cItemCtrlArray.length-1);};// 
	zjtoolbar.children[2].onclick = function(){cqself_0701.deleteAllCItem();};
	this.errorContainer = document.getElementById(errorId); //zjtoolbar.children[3];

	//分割条
	var sep = document.createElement("DIV"); 
	this.container.appendChild(sep);
	//ElementHelper.setAttribute(sep, "style", "width:100%;height:3px;background:#a0a0a0");
	$(sep).css("width","100%");
	$(sep).css("height", "3px");
	$(sep).css("background", "#a0a0a0");
	
	//条件项
	var div = document.createElement("div");
	this.cItemContainerDIV = div;
	var h = this.containerSize.height - this.m_zjButtonHeight - this.m_logicButtonHeight - this.m_exprContainerHeight - this.m_conditionContainerHeight-15;
	//if (h<50) h=50;
	//ElementHelper.setAttribute(div,"style", "width:100%;height:"+h+"px;background:#f5f5f5;");
	$(div).css("width","100%");
	$(div).css("height", h+"px");
	$(div).css("background", "#f5f5f5");	
	
	this.container.appendChild(div);
	
	var cItemtheaderDIV = document.createElement("div");
	this.cItemContainerDIV.appendChild(cItemtheaderDIV);
	$(cItemtheaderDIV).css("width","100%");
	$(cItemtheaderDIV).css("height",this.m_cItemHeaderHeight+"px");
	$(cItemtheaderDIV).css("background","#e0e0e0");
		
	//计算有多少列
	this.m_columnNumber = Math.floor((this.containerSize.width-20)/this.m_cItemWidth);
	if (this.m_columnNumber<1) this.m_columnNumber = 1;
	
	this.buildHeader(this.cItemContainerDIV.children[0]);
	
	this.cItemContentDIV = document.createElement("div");
	this.cItemContainerDIV.appendChild(this.cItemContentDIV);
	$(this.cItemContentDIV).css("width","100%");

	$(this.cItemContentDIV).css("height", (h-this.m_cItemHeaderHeight-10)+"px");
	$(this.cItemContentDIV).css("background","#f5f5f5");
	$(this.cItemContentDIV).css("overflow-y","scroll");
	
	this.cItemContentDIV.innerHTML = "<TABLE style='width:"+this.m_columnNumber*this.m_cItemWidth+"px' cellspacing=0 cellpadding=0 border=0 ><tbody></tbody></TABLE>";
	this.cItemContentTABLE = this.cItemContentDIV.children[0];
	
	this.cItemContentTBODY = this.cItemContentTABLE.children[0]; //TBODY
};

//返回条件组合方式  AND OR
CQWindow.prototype.getCombType = function(){
	//return $(this.zhfsId).val();
	return $("input:radio[name='"+this.zhfsName+"']:checked").val();
};

//设置条件组合方式 AND  OR
CQWindow.prototype.setCombType = function(type){
	var id = this.zhfsId+"_"+type.toUpperCase();
	//alert(id);
	$("#"+id).attr("checked", "true");
	//return $("input:radio[value='"+type+"']").attr("checked", "true");
};

CQWindow.prototype.onCItemDelete = function(cItemIndex, cItemObj){
	//alert(cItemIndex);	
	this.deleteCriItem(cItemIndex-1);
};

CQWindow.prototype.onCItemChange = function(cItemIndex, cItemObj){	
	this.checkAndBuildSQLCondition();
};

//获取容器大小
CQWindow.prototype.getSize = function(e){
	var h = $(e).outerHeight(true);//(); //e.offsetHeight;
	var w = $(e).outerWidth(true);//(); //e.offsetWidth;
	var size = {'width':w, 'height':h};
	return size;
};

CQWindow.prototype.setPercent100 = function(){
	$(this.container).css("height", "100%");
	$(this.container).css("width", "100%");
};

//设置容器大小
CQWindow.prototype.setSize = function(e, size){

	if (size.height<0)
		$(e).css("height", "100%");
	else
		$(e).css("height", size.height+"px");
	
	if (size.width<0)
		$(e).css("width", "100%");
	else
		$(e).css("width", size.width+"px");
	
	this.reSize();
};

/*
根据列数重新创建头部
*/
CQWindow.prototype.buildHeader = function(headerDivObj){
	var cItemtheaderDIV = headerDivObj;
	
	var cItemHeaderHTML0 = "<table cellspacing=0 cellpadding=0 style='border:0px solid #f5f5f5;float:left;width:{0}px;height:99%'><tr style='width:100%;height:100%'>";
	var cItemHeaderHTML1 = "<td style='width:{1}px;height:100%;text-align:left'>序号</td><td style='width:{2}px;height:100%;text-align:center'>字段&nbsp&nbsp</td><td style='width:{3}px;height:100%;text-align:center'>操作符&nbsp&nbsp</td><td style='width:{4}px;height:100%;text-align:center'>操作数&nbsp&nbsp</td><td style='width:{5}px;height:100%;align:right'></td>";
	var cItemHeaderHTML1_1 = "<td style='width:{1}px;height:100%;text-align:left'>|序号</td><td style='width:{2}px;height:100%;text-align:center'>字段&nbsp&nbsp</td><td style='width:{3}px;height:100%;text-align:center'>操作符&nbsp&nbsp</td><td style='width:{4}px;height:100%;text-align:center'>操作数&nbsp&nbsp</td><td style='width:{5}px;height:100%;align:right'></td>";
	var cItemHeaderHTML2 ="</tr></table>";
	cItemHeaderHTML1 = cItemHeaderHTML1.format(this.m_cItemWidth, this.m_ColumnWidth.index, this.m_ColumnWidth.field, this.m_ColumnWidth.operator, this.m_ColumnWidth.operand, this.m_ColumnWidth.del);
	cItemHeaderHTML1_1 = cItemHeaderHTML1_1.format(this.m_cItemWidth, this.m_ColumnWidth.index, this.m_ColumnWidth.field, this.m_ColumnWidth.operator, this.m_ColumnWidth.operand, this.m_ColumnWidth.del);
	var array = new Array();
	for(var index=1; index<this.m_columnNumber; index=index+1){
		//array.push(cItemHeaderHTML1);
		array.push(cItemHeaderHTML0+cItemHeaderHTML1_1+cItemHeaderHTML2);
	}
	//cItemtheaderDIV.innerHTML = cItemHeaderHTML0 + array.join("") + cItemHeaderHTML2;
	cItemtheaderDIV.innerHTML = cItemHeaderHTML0+cItemHeaderHTML1+cItemHeaderHTML2 + array.join("");		
}

CQWindow.prototype.reSize = function(){

	this.containerSize = this.getSize(this.container);
	
	var div = this.cItemContainerDIV;
	var h = this.containerSize.height - this.m_zjButtonHeight - this.m_logicButtonHeight - this.m_exprContainerHeight - this.m_conditionContainerHeight-15;

	if (h<25) h = 25;
	$(div).css("width", "100%");
	$(div).css("height", h+"px");
	$(div).css("background","#f5f5f5");

	$(this.cItemContentDIV).css("height", (h-this.m_cItemHeaderHeight-10)+"px");

	//重新排列
	//计算有多少列,动态根据宽度计算列数
	var cNumber = Math.floor((this.containerSize.width-20)/this.m_cItemWidth);
	if (cNumber<1) cNumber = 1;
	if (cNumber==this.m_columnNumber)
		return;
	
	this.m_columnNumber = cNumber;//如果列数发生变化，则重新排列.
	$(this.cItemContainerDIV.children[0]).empty();
	
	this.buildHeader(this.cItemContainerDIV.children[0]);
	
	//重新排列条件项
	//删除所有行
	var p1 = this.cItemContentTABLE.parentNode;
	$(p1).css("background-color","#0000ff");
	$(this.cItemContentTABLE).css("width", this.m_cItemWidth*this.m_columnNumber+"px");
	//alert("this.m_cItemWidth*this.m_columnNumber=" + this.m_cItemWidth*this.m_columnNumber);
	var p = this.cItemContentTBODY.parentNode;
	var e1 = this.cItemContentTBODY.cloneNode(false);
	$(e1).css("width","100%");
	//return;
	//计算条件项个数以及行数
	var cItemCnt = this.cItemCtrlArray.length;
	//alert(cItemCnt);
	var m_rowNumber = Math.ceil(cItemCnt / this.m_columnNumber);
	//alert("m_rowNumber" + m_rowNumber);
	var cItemIndex = 1;
	$(this.cItemContentTBODY).css("background-color","#ff0000");
	for(rowIndex=0; rowIndex<m_rowNumber; rowIndex=rowIndex+1){
		var tr = document.createElement("TR");
		//this.cItemContentTBODY.appendChild(tr);
		e1.appendChild(tr);
		$(tr).css("with", "100%");
		$(tr).css("height", this.m_TRHeight + "px");
		$(tr).css("background-color", "#ff0000");
		for(var cIndex=0; cIndex<this.m_columnNumber; cIndex=cIndex+1){
			var td = document.createElement("td");
			$(td).css("width", this.m_cItemWidth + "px");
			$(td).css("height", "100%");
			//$(td).css("background", "#f5f5f5");
			$(td).css("background", "#ff00ff");
			if (cItemIndex<=this.cItemCtrlArray.length){
				td.appendChild(this.cItemCtrlArray[cItemIndex-1].getContainer());
				cItemIndex = cItemIndex +1;
			}
			tr.appendChild(td);
			
		}
	}

	var x = this.cItemContentTBODY.parentNode;
	x.removeChild(this.cItemContentTBODY);
	p.appendChild(e1);
	this.cItemContentTBODY = e1;

	this.cItemContentDIV.scrollTop = this.cItemContentDIV.scrollHeight; 
}

/**
返回指定索引号的条件项
*/
CQWindow.prototype.getCriItem = function(cItemIndex){
	return this.cItemCtrlArray[cItemIndex];
};

/**
 * 删除指定索引号的条件项
 * @param index
 * @return
 */
CQWindow.prototype.deleteCriItem = function(index){
	//从TD中删除
	var rc = this.getRowAndColumnIndex(index);
	var td = this.getTDByRowAndColumnIndex(rc);
	
	//删除节点的实际对象
	$(td).empty();

	//删除保存条件项的控件对象
	this.cItemCtrlArray.splice(index, 1); //条件项对象减少1
	//alert(this.cItemCtrlArray.length);
	//调整显示序号
	var i = index;
	for(i=index; i<this.cItemCtrlArray.length; i=i+1){
		this.cItemCtrlArray[i].setIndex(i+1); //显示的序号1开始。
	}
	
	//将从index开始的后面的条件项往前移动
	this.MoveCriItemsAhead(index); //在界面上移动条件项

	var cItemCnt = this.cItemCtrlArray.length;
	//判断当前的条件项数是否刚好为this.column的整数倍，如果是，则应该让最后一行TR消失
	if (cItemCnt%this.m_columnNumber==0){
		var r = Math.floor((cItemCnt)/this.m_columnNumber);
		$(this.cItemContentTBODY.children[r]).empty();
		this.cItemContentTBODY.removeChild(this.cItemContentTBODY.children[r]);
	}	
};

/**
增加一个条件项
*/
CQWindow.prototype.addCriItem = function(){
	//alert(0);
	if (this.m_criConfig==null || this.m_criConfig.length==0){
		alert("没有配置字段信息");
		return null;
	}

	var cqself_0701 = this;
  
	//创建一个条件项对象
	var p = {};
	p.criConfig = this.m_criConfig;
	p.columnWidth = this.m_ColumnWidth;
	p.index = this.cItemCtrlArray.length+1;
	var cItem = new CriItem("", p);
	cItem.create();
	//alert(2);
	
	cItem.attachEvent("onbeforedelete", this.onCItemDelete.bind(this));
	cItem.attachEvent("onchange", this.onCItemChange.bind(this));
		
	this.cItemCtrlArray.push(cItem);
  
	var cItemCnt = this.cItemCtrlArray.length;
  
	if ((cItemCnt-1) % this.m_columnNumber==0){
		//能够整除说明：在增加之前刚好填满已有的行。新的项需要重新分配一行。
		//求新项所在的行，并显示该行.
		this.createTR(); 		
	}

	var rc = this.getRowAndColumnIndex(cItemCnt-1);
	//alert(rc.rIndex + "  " + rc.cIndex);
	var td = this.getTDByRowAndColumnIndex(rc);
	td.appendChild(cItem.getContainer());
	
	this.cItemContentDIV.scrollTop = this.cItemContentDIV.scrollHeight; 
	
	return cItem;
};

/**
 * 删除所有的条件项
 * @return
 */
CQWindow.prototype.deleteAllCItem = function(){
	var cItemCnt = this.cItemCtrlArray.length;
	//找到最后一项所在的行和列
	var rc = this.getRowAndColumnIndex(cItemCnt-1);
	
	//删除从第0行到rc.rIndex-1行的所有行
	for(var rIndex=rc.rIndex; rIndex>=0; rIndex=rIndex-1){
		$(this.cItemContentTBODY).empty();
	}

	this.cItemCtrlArray = new Array();
}

/**
返回条件数组
*/
CQWindow.prototype.getCondition = function(){

	cItemExprArray = new Array();
	
	for(var index=0; index<this.cItemCtrlArray.length; index++){
		var cItem = "";
		
		var obj = this.cItemCtrlArray[index];
		
		cItemExprArray.push( obj.getCondition());
	}
	
	return cItemExprArray;
}

/**
返回组合后的条件数组
bracket:true,表示在每个条件前后加上().
*/ 
CQWindow.prototype.getSQLCondition = function(bracket){

	cItemExprArray = new Array();
	
	var l = "", r = "";
	
	if (typeof(bracket)!="undefined" && bracket==true){
		l = "("; r = ")";
	}
	
	for(var index=0; index<this.cItemCtrlArray.length; index++){
		var cItem = "";
		
		var obj = this.cItemCtrlArray[index];
		
		cItemExprArray.push( l + obj.getSQLCondition() + r);
	}
	
	return cItemExprArray;
}

/**
返回组合后的条件字符串
*/ 
CQWindow.prototype.getJoinedSQLCondition = function(){
	return this.getSQLCondition(true).join(" " + this.getCombType() + " ");
}

/**
 * 根据给定的条件项的索引号，判断其所在的行列。
 * @param index  从0开始
 * @return
 */
CQWindow.prototype.getRowAndColumnIndex =function(index){
		
	var r = Math.floor(index/this.m_columnNumber);
	var c = index%this.m_columnNumber;
	
	var rtvl = {};
	rtvl.rIndex = r;
	rtvl.cIndex = c;
	
	return rtvl;
}

/**
 * 在UI上将索引号为sIndex的条件项移动到dIndex位置
 * @param sIndex
 * @param dIndex
 * @return
 */
CQWindow.prototype.moveCriItem = function(sIndex, dIndex){
	var sRC = this.getRowAndColumnIndex(sIndex);
	var dRC = this.getRowAndColumnIndex(dIndex);
	
	var std = this.getTDByRowAndColumnIndex(sRC);
	var dtd = this.getTDByRowAndColumnIndex(dRC);
	dtd.appendChild(std.children[0]);
}

CQWindow.prototype.getTDByRowAndColumnIndex = function(rc){
	var tbody = this.cItemContentTBODY;
	var tr = tbody.children[rc.rIndex];
	var td = tr.children[rc.cIndex];
	return td;
}

/**
 * 删除指定索引号的条件项，并将后继的条件项向前移动
 * @param index
 * @return
 */
CQWindow.prototype.MoveCriItemsAhead =function(index){
	
	var cItemCnt = this.cItemCtrlArray.length;
	
	var i = index;
	for(i=index+1; i<=cItemCnt; i=i+1){
		this.moveCriItem(i, i-1);
	}
}

//创建一行
CQWindow.prototype.createTR =function(){

	var tr = document.createElement("TR");
	this.cItemContentTBODY.appendChild(tr);
	$(tr).css("with", "100%");
	$(tr).css("height", this.m_TRHeight + "px");
	for(var index=0; index<this.m_columnNumber; index=index+1){
		var td = document.createElement("td");
		$(td).css("width", this.m_cItemWidth + "px");
		$(td).css("height", "100%");
		$(td).css("background", "#f5f5f5");
		tr.appendChild(td);
	}
	return tr;
}
