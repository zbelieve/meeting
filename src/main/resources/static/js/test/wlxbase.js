/*! wlxbase 20190731 | (c) JS Foundation and other contributors  */
//FJS
(function(){

	//支持成员函数作为AJAX的回调函数
	var __memeberRecall_help = function (iterable) {
		if (!iterable) return [];
		if (iterable.toArray) return iterable.toArray();
		var length = iterable.length, results = new Array(length);
		while (length--) results[length] = iterable[length];
		return results;
	};

	$.extend(Function.prototype, {
			bind: function() {
				// alert(1);
				if (arguments.length < 2 && arguments[0] === undefined) return this;
				var __method = this, args = __memeberRecall_help(arguments), object = args.shift();
				return function() {
					return __method.apply(object, args.concat(__memeberRecall_help(arguments)));
				}
			}
		}
	);

	//String类扩展
	/*数值判断*/
	String.prototype.isInt  = function(){
		return /^[\d]+$/.test(this);
	};

	String.prototype.isFloat  = function(){
		return /^[\d\.]+$/.test(this);
	};

	/*数值转换*/
	String.prototype.toFloat= function(){
		var value = this.replace(/[^\d.]/g,"");  //清除"数字"和"."以外的字符
		value = value.replace(/^\./g,"");  //验证第一个字符是数字而不是.
		value = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的.
		return value;
	};

	String.prototype.toInt = function(){
		var value = this.replace(/[^\d]/g,"");  //清除"数字"以外的字符
		return value;
	};

	/**
	 * 判断字符串是否以 prefix开始
	 * @param prefix
	 * @returns {boolean}
	 */
	String.prototype.startWith = function(prefix){
		if(prefix==null||prefix==""||this.length==0||prefix.length>this.length)
			return false;

		if(this.substr(0,prefix.length)==prefix)
			return true;
		else
			return false;

		return true;
	};

	/**
	 * 判断字符串是否以postfix结束
	 * @param postfix
	 * @returns {boolean}
	 */
	String.prototype.endWith=function(postfix){
		if(postfix==null||postfix==""||this.length==0||postfix.length>this.length)
			return false;
		if(this.substring(this.length-postfix.length)==postfix)
			return true;
		else
			return false;

		return true;
	};

	/**
	 * 将string中所有 c替换成r.
	 * 替换后的结果存放在新字符串中.原来的字符串不改变.
	 * @param c
	 * @param r
	 * @returns {string}
	 */
	String.prototype.replaceAll  = function(c, r){
		var s = this.substring(0, this.length);
		do{
			s = s.replace(c, r);
		}while(s.indexOf(c) >= 0)

		return s;
	};

	/**
	 *  * 字符串格式化.
	 *  格式化后会产生新的字符串.原来的字符串不改变.
	 usage:
	 var template1="我是{0}，今年{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}了";
	 var template2="我是{name}，今年{age}了{xx}";
	 var template3="我是{name}，今年{age}了";
	 var result1=template1.format("loogn",22,22,22,22,22,22,22,22,22,22);
	 var result2=template2.format({name:"loogn",age:22,xx:33});
	 var result3 = template3.format({name:'xx',age:22});
	 * @param args
	 * @returns {String}
	 */
	String.prototype.format = function(args) {
		var result = this;
		if (arguments.length > 0) {

			if (arguments.length == 1 && typeof (args) == "object") {
				for (var key in args) {
					if(args[key]!=undefined){
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 0; i < arguments.length; i=i+1) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({)" + i + "(})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	};

	/**
	 * 将字符串转换成SQL中的in操作格式.
	 * 每项带单引号，对整数和字符串都适用.
	 usage:
	 var  s = "a,b,c";
	 s.toSQLInFormat(s); //('a',' b','c')
	 * @param delimiter
	 * @returns {*}
	 */
	String.prototype.toSQLInFormat = function(delimiter) {
		if (this==null || this =='') return "()";
		if (typeof(delimiter)=='undefined'|| delimiter == null) delimiter = ",";
		var array = this.split(delimiter);
		return array.toSQLInFormat();
	};

	/**
	 将数组元素转换成SQL中的in操作格式.
	 usage:
	 var  s = ['a','b','c'];
	 toSQLInFormat(s); //(‘a’,'b’,'c’)
	 * @returns {string}
	 */
	Array.prototype.toSQLInFormat  = function(){
		if (this==null || this.length==0) return "()";

		var rtvl = "";
		for(var index=0; index<this.length; index=index+1){
			if (index==0)
				rtvl = "'" + this[index] + "'";
			else
				rtvl = rtvl + "," + "'" + this[index] + "'";
		}

		return "(" + rtvl + ")";
	};

	/**
	 *格式化日期：与java格式兼容
	 yyyy(年) MM(月) dd(日) HH(时1-24) hh(1-12) mm(分) ss(秒) SSS(毫秒)

	 * @param format
	 * @returns {*}
	 */
	Date.prototype.format  = function(format){
		var yyyy = (this.getYear()+1900);
		var MM = this.getMonth()+1;
		if (MM<10)
			MM = "0" + MM;
		var dd = this.getDate();
		if (dd<10)
			dd = "0" + dd;

		var HH = this.getHours();
		if (HH<10)
			HH = "0" + HH;

		var mm = this.getMinutes();
		if (mm<10)
			mm = "0" + mm;

		var ss = this.getSeconds();
		if (ss<10)
			ss = "0" + ss;

		var SSS = this.getMilliseconds();
		if (SSS<10)
			SSS = "00" + SSS;
		else if (ss<100)
			SSS = "0" + SSS;

		format = format.replaceAll("yyyy", yyyy);
		format = format.replaceAll("MM", MM);
		format = format.replaceAll("dd", dd);
		format = format.replaceAll("HH", HH);
		format = format.replaceAll("mm", mm);
		format = format.replaceAll("ss", ss);
		format = format.replaceAll("SSS", SSS);

		return format;
	};

	/**
	 创建UUID唯一号。基本的实现方式是系统从一串字符串中为UUID中每个字符选择符号。
	 UUID的长度由len指定，可选择的字符串范围由radix确定。可选的字符包括'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'共62个字符。
	 	参数
	 len:uuid长度，默认为36。radix:进制，默认为62，即从所有字符中选择。
	 	返回值: 创建的UUID。
	 	举例
	 String.uuid(); //标准创建：创建长度为36的UUID唯一号。符号从前16个字符中选择。
	 String.uuid(16, 16); //创建长度为16的UUID唯一号,唯一号中的字符从前16个字符中选择。
	 * @param len
	 * @param radix
	 * @returns {string}
	 */
	String.uuid = function(len, radix){
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		var uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i=i+1) uuid[i] = chars[0 | Math.random()*radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i=i+1) {
				if (!uuid[i]) {
					r = 0 | Math.random()*16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	};

	var fjs = {};

		/**
	 	* 通过jQuery Ajax 调用服务器方服务
	 	* @type {{request: AjaxRequest.request, postSync: (function(*, *): string), success: AjaxRequest.success, postAsync: AjaxRequest.postAsync}}
	 	*/
	fjs.AjaxRequest = {
		/**
		 * post异步请求
		 * @param url
		 * @param param json对象，如果没有参数null
		 * @param success 结果处理函数参数
		 */
		postAsync : function(url, param, success){

			if (arguments.length!=3){
				alert("postAsync函数需要提供3个参数!");
				return;
			}

			var p = {};
			p.type = 'post';
			p.dataType = 'json';
			p.async = true;
			p.url = url;

			p.parameter = param;

			if(typeof(success)=='undefined' || success==null){
				alert("异步调用ajax，必须提供处理的success函数!");
				return;
			}
			p.success = success;

			this.request(p);
		},

		/**
		 * post同步请求
		 * @param url
		 * @param param json对象，如果没有参数null
		 * @returns {string}
		 */
		postSync: function(url, param){

			if (arguments.length!=2){
				alert("postSync函数需要提供2个参数!");
				return;
			}

			var p = {};
			p.type = 'post';
			p.dataType = 'json';
			p.async = false;
			p.url = url;
			p.parameter = param;

			p.r1e1s1p1o1n1s1e_0703 = ""; //外部传递参数时，不能有任何成员与此相同。
			p.success = null;
			this.request(p);
			return p.r1e1s1p1o1n1s1e_0703;
		},

		/**
		 * AJAX调用请求
		 *
		 * 	参数包括
		 p.url:服务器方响应URL；
		 p.parameter:需要传递给服务器方的参数；{}格式
		 p.dataType:数据类型，xml,json. 默认为json.服务器方返回的是json格式数据，
		 客户端ajax组件会根据该设置自动解析服务器方的返回参数。服务器方的返回数
		 据格式需要和该设置对应；
		 p.type:post,get 默认为post;
		 p.succes:回调函数;
		 p.async:同步/异步;默认为异步.如果为同步调用，则sucess可以为null

		 返回的参数格式为：参数为json对象,默认包含:code,message,content.
		 * @param p
		 * @returns {*}
		 */
		request: function(p){

			//默认为json
			if (typeof(p.dataType)=='undefined' || p.dataType==null || p.dataType==''){
				p.dataType = 'json';
			}
			//默认为post
			if (typeof(p.type)=="undefined" || p.type==null || p.type == '') {
				p.type = 'post';
			}

			//未提供处理函数
			if (typeof(p.success)=="undefined" || p.success==null || p.success==''){
				p.success = null;
			}

			//默认异步
			if (typeof(p.async)=='undefined' || p.async==null){
				p.async = true;
			}

			if (typeof(p.contentType)=="undefined" || p.contentType==null || p.contentType==''){
				//p.contentType = "application/x-www-form-urlencoded";
				p.contentType = "application/json; charset=utf-8";
			}

			if (p.async==true && p.success==null){
				alert("你进行了异步调用，是没有提供success处理函数,ajax调用不执行!");
				return;
			}

			var data = null;
			if (p.contentType.indexOf("application/json")>=0){
				//如果是提交json格式,必须采用JSON.stringify转换成字符串.
				data = JSON.stringify(p.parameter);
			}
			else{
				data = p.parameter;
			}

			jQuery.ajax({
				url 	   : p.url
				, data     : data
				//如果contentType:'application/x-www.....，则data直接可以是json对象
				//jQuery内部自动编码产生参数串;
				//如果contentType:'application/json; charset=utf-8'，则data需要是符合json格式的字符串,
				// 所以要采用JSON.stringify转换成字符串，而不是直接传递JSON对象.
				, contentType: p.contentType //'application/json; charset=utf-8'
				, dataType : p.dataType //返回的数据格式 XML，JSON
				, type     : p.type //提交类型 post,get
				, async    : p.async
				, error    : function(response, textStatus,errorThrown){alert("JQuery Ajax调用出错：\ntextStatus=" + textStatus + "\nerrorThrown=" + errorThrown + "\nresponseText=" + response.responseText);}
				, success  : function(response){
					//response.serverResp是完整的返回对象.
					//服务器方返回的数据的格式要和客户端指定的希望的数据格式dataType相同,客户端jQuery会根据dataType
					//的设置对返回的数据进行转换，并调用success函数.如果dataType:为xml,则客户端jQuery将返回内容转换成
					//xml对象, 然后调用success;如果dataType为json，则jQuery将返回内容转换成json对象，即response已经
					//为json对象，然后调用success.

					//即response是XML对象或JSON对象.

					var rtvl = null;

					/*
                      * 服务器方返回的格式为：
                     * {serverResp:{code:'200',message:'',content:...}
                      */
					if (p.dataType=='xml'){
						//alert('xml');
						//<serverResp><code></code><message></message><content>...</content></serverResp>
						//解析返回的字符串,reponse中是已经被jQuery转换后的xml对象.
						//var code = $(response).find("serverResp").find("code").text();
						//var message = $(response).find("serverResp").find("message").text();
						//var content = $(response).find("serverResp").find("content").();
						//根据解析的结果组合成json对象返回给客户端调用者.
						//rtvl = {'code':code,'message':message,'content':content,'response':response};
						//这里注意：如果服务器方对content的内容采用的是json格式，则这里仍然是字符串格式。因为整个是被包含在XML中.
						rtvl = response;
					}
					/*
                     * 服务器方返回的格式为：
                     * {serverResp:{code:'',message:'',content:}
                     * content属性的内容可以是普通字符串,xml数据，或者json数据.
                     * 如果是xml数据，则在客户端通过.content取出的还是普通的字符串，需要采用xml组件进行转换成xml对象，然后进行解析.
                     */
					else if (p.dataType=='json'){
						//resonse中是已经被jQuery转换后的json对象
						rtvl = response.serverResp;
					}

					//已经把返回结果放到rtvl中

					if (p.async){ //异步调用
						p.success(rtvl);
					}else{
						p.r1e1s1p1o1n1s1e_0703 = rtvl;
					}
				}
			});

			//同步调用,直接返回
			if (p.async==false){
				return p.r1e1s1p1o1n1s1e_0703;
			}
		},

		//默认提供的处理函数
		success:function(resp){
			alert(resp.message);
		}
	};


	fjs.DBMS = {
		"provider":"ORACLE",

		"SQLOperator":{
			/*设置SQL操作符的标准操作符号和标准名*/
			"name":{"is null":"为空",
				"is not null":"不为空",
				"=":"等于",
				"!=":"不等于",
				">":"大于",
				">=":"大于等于",
				"<":"小于",
				"<=":"小于等于",
				"like":"包含",
				"like_pre":"前包含",
				"like_middle":"中间包含",
				"like_post":"后包含",
				"in":"包含列表值",
				"not in":"不包含列表值"
			},
			/*设置所有的SQL操作符和别名的对应关系*/
			"alias": {"e":"=","eq":"=","=":"=","equal":"=",
				"ne":"!=","!=":"!=",
				"g":">","gt":">",">":">",
				"ls":"<","<":"<",
				"ge":">=",">=":">=",
				"le":"<=","<=":"<=",
				"like":"like","lk":"like",
				"isnull":"is null","is null":"is null",
				"isnotnull":"is not null","is not null":"is not null","is_not_null":"is not null",
				"in":"in",
				"notin":"not in","not in":"not in", "not_in":"not in",
				"like_pre":"like_pre",
				"like_middle":"like_middle",
				"like_post":"like_post"
			},

			//number类型数据操作符
			"number":[{"value":"is null","text":"为空"},
				{"value":"is not null","text":"不为空"},
				{"value":"<","text":"小于"},
				{"value":"<=","text":"小于等于"},
				{"value":">","text":"大于"},
				{"value":">=","text":"大于等于"},
				{"value":"=","text":"等于"},
				{"value":"!=","text":"不等于"}],

			//date类型数据操作符
			"date":[{"value":"is null","text":"为空"},
				{"value":"is not null","text":"不为空"},
				{"value":"<","text":"小于"},
				{"value":"<=","text":"小于等于"},
				{"value":">","text":"大于"},
				{"value":">=","text":"大于等于"},
				{"value":"=","text":"等于"},
				{"value":"!=","text":"不等于"}],

			//string类型数据操作符
			"string":[{"value":"is null","text":"为空"},
				{"value":"is not null","text":"不为空"},
				{"value":"<","text":"小于"},
				{"value":"<=","text":"小于等于"},
				{"value":">","text":"大于"},
				{"value":">=","text":"大于等于"},
				{"value":"=","text":"等于"},
				{"value":"!=","text":"不等于"},
				{"value":"like","text":"包含"},
				{"value":"like_pre","text":"前包含"},
				{"value":"like_middle","text":"中间包含"},
				{"value":"like_post","text":"后包含"}],

			//dict类型数据操作符
			"dict_number":[{"value":"is null","text":"为空"},
				{"value":"is not null","text":"不为空"},
				{"value":"=","text":"等于"},
				{"value":"!=","text":"不等于"},
				{"value":"in","text":"包含列表值"},
				{"value":"not in","text":"不包含列表值"}],

			"dict_string":[{"value":"is null","text":"为空"},
				{"value":"is not null","text":"不为空"},
				{"value":"=","text":"等于"},
				{"value":"!=","text":"不等于"},
                {"value":"like","text":"包含"},
				{"value":"in","text":"包含列表值"},
				{"value":"not in","text":"不包含列表值"}],

			//"dict_grid":[{"value":"is null","text":"为空"},{"value":"is not null","text":"不为空"},{"value":"=","text":"等于"},{"value":"!=","text":"不等于"},{"value":"in","text":"包含列表值"}],
			//如果以树结构展示，编码一定是字符串. 设定上下级编码之间具有前缀的关系。即父级编码是子级编码的前缀.
			//"dict_tree":[{"value":"is null","text":"为空"},
			//             {"value":"is not null","text":"不为空"},
			//			 {"value":"=","text":"等于"},
			//			 {"value":"!=","text":"不等于"},
			//			 {"value":"like_pre","text":"前包含"}]
		},

		'toDateTime': function(opvalue, dateformat){
			if (fjs.DBMS.provider=='SQLSERVER')
				return " cast('" + opvalue + "' " + "as datetime, '" + dateformat+ "')";
			else if(fjs.DBMS.provider=='ORACLE')
				return "'" + opvalue + "'";
		},

		SQLConditionBuilder:{
			/*
            datatype:number, string
            op:标准的SQL操作符
            */
			'build':function(datatype, op, opvalue){
				op = fjs.DBMS.SQLOperator.alias[op]; //转换成标准的SQL操作符
				if (op==null || typeof(op)=='undefined'){
					alert("build 错误的操作符号!");
					return '';
				}

				if (op=='is null' || op=='is not null'){
					return  op;
				}

				//没有操作数，则直接返回空
				if (opvalue=='') return '';

				//like ,in 特殊处理
				if (op=='like'){ //string dict
					//若包含%则直接组合，否则前后添加%,_
					var pos = opvalue.indexOf("%");
					var pos2 = opvalue.indexOf("_");
					if (pos>=0 || pos2>=0)
						return " like '" + opvalue +"'";
					else
						return " like '%" + opvalue +"%'";

				}if (op=='like_pre'){
					return "like '" +  opvalue + "%'";

				}if (op=='like_middle'){
					return "like '%" +  opvalue + "%'";

				}if (op=='like_post'){
					return "like '%" +  opvalue + "'";

				}else if (op=='in' || op=='not in'){
					if (datatype=='string'){
						var items = opvalue.split(",");
						var itemArray = new Array();
						for(var index=0; index<items.length; index++){
							itemArray.push("'"+items[index]+"'");
						}

						return  op+" (" + itemArray.join(",") + ")";

					}
					else if (datatype='number'){
						var items = opvalue.split(",");
						var itemArray = new Array();
						for(var index=0; index<items.length; index=index+1){
							itemArray.push(items[index]);
						}

						return  " in (" + itemArray.join(",") + ")";
					}

				}else{//其他操作符
					if (datatype=="string"){
						return op + " '" + opvalue +"'";

					}else{//number,或者to_date等日期形式
						return op + " " + opvalue;
					}
				}

				return "";
			},
		}
	};

	/**
	 * 数据库操作对象
	 */
	fjs.UDABS ={ //UnifyDataAccessBUS

		/**是否对SQL进行编码，防止服务器方进行安全控制*/
		'SQLEncode': 0,

		/**服务器方处理响应的servlet*/
		'url': "./UnifyDataAccessBUSRespServlet",

		/**
		 * 判断SQL语句是否返回记录，若存在返回true.否不存在则返回false, 若执行过程中出错则返回false.
		 * sql语句的写法：select count(*) as length from table where condition
		 */
		'exists': function (sql) {
			var rtvl = this.executeQuery(sql);
			if (rtvl.code == 200) {
				rtvl = rtvl.content.resultSet;
				return rtvl[0].length >= 1 ? true : false;
			} else {
				alert("执行SQL语句出错:\n" + "SQL:" + sql + "\n 出错原因:" + rtvl.message);
				return false;
			}

			return false;
		},

		/**
		 功能: 查询数据库数据,返回满足SQL要求的所有记录.
		 usage:
		 var rtvl = UDABS.execQuery(...);
		 var rs = rtvl.content.resultSet; rs为json数组，每个数组元素为一行数据对象。
		 数据访问通：rs[行索引].字段名

		 * @param sql  提供执行的SQL语句 select
		 * @param success 如果提供，则异步执行，如果不提供，则同步执行
		 * @returns {*|string} 返回数据集 为json数据对象数组格式
		 */
		'executeQuery': function (sql, success) {
			if (typeof (success) == 'undefined') {//同步访问
				success = null;
			}
			var sqlParameter = {};

			if (this.SQLEncode == 1) {
				sqlParameter.sql = Base64.encode(sql);
				sqlParameter.sqlencode = "1";
			} else {
				sqlParameter.sql = sql;
				sqlParameter.sqlencode = "0";
			}

			sqlParameter.command = "executeQuery";
			var url = this.url;

			if (success == null) {
				return fjs.AjaxRequest.postSync(url, sqlParameter);
			} else {
				fjs.AjaxRequest.postAsync(url, sqlParameter, success);
			}
		},

		/**
		 * 分页查询，返回满足SQL要求的，并且在指定页的记录.
		 *
		 * 每张表增加一个AUTO_ID
		 * @param table
		 * @param column
		 * @param condition
		 * @param order
		 * @param pageNo
		 * @param pageSize
		 * @param success
		 * @returns {*|string}
		 */
		'executePageQuery': function (p, success) {
			var sqlParameter = p;
			sqlParameter.command = "executePageQuery";
			var url = this.url;

			if (success == null) {
				return fjs.AjaxRequest.postSync(url, sqlParameter);
			} else {
				fjs.AjaxRequest.postAsync(url, sqlParameter, success);
			}

		},

		/**
		 * 功能: 执行批量SQL语句.无占位符。没有返回记录集. 用于delete,update,insert.
		 *
		 * @param sqlList  SQL语句数组
		 * @param success 执行的响应函数，如果不提供，则同步执行
		 * @returns {*|string}
		 * 若success不为空，则接收json格式的返回参数对象，包括成员：code,message,content
		 若success为空，则直接接收返json对象返回值，成员同上。
		 */
		'executeBatch':function(sqlList, success){
			if (typeof (success) == 'undefined') {
				success = null;
			}

			var sqlParameter = {};

			if (this.SQLEncode==1)
				sqlParameter.sqlencode = "1";

			for(var index=0; index<sqlList.length; index=index+1){

				if (this.SQLEncode==1){
					sqlParameter["sql"+index] = Base64.encode(sqlList[index]);
				}
				else
					sqlParameter["sql"+index] = sqlList[index];
			}

			sqlParameter.length = sqlList.length+"";
			sqlParameter.command = "executeBatch";

			var url = this.url;

			if (success==null){
				return fjs.AjaxRequest.postSync(url, sqlParameter);
			}else{
				fjs.AjaxRequest.postAsync(url, sqlParameter, success);
			}
		},

		/**
		 * 功能: 执行带参数的SQL语句,用于insert,delelete,insert. 不返回记录集,不能执行select。
		 * @param sql  带占位符的SQL语句
		 * @param vtArray
		 参数数组，每个参数包括value,dataType成员,dataType取值为string,number
		 注意:每个value都采用字符串格式提供. value为空时，设置为nul 或 不提供.
		 如:
		 vtArray = new Array();
		 vtArray[0] = {'value':'100','dataType':'number'};
		 vtArray[1] = {'value':'aa','dataType':'string'};
		 vtArray[2] = {'value':null,'dataType':'number'};
		 vtArray[3] = {'dataType':'number'};
		 支持的类型包括:number,float,double,integer,string,date,datetime
		 date类型时,value的格式为:yyyy-MM-dd
		 datetime类型时, value的格式为:yyyy-MM-dd HH:mm:ss 或者yyyy-MM-dd HH:mm:ss:SSS
		 * @param success
		 * @returns {*|string}
		 若success不为空，则接收json格式的返回参数对象，包括成员：code,message,content
		 若success为空，则直接接收返json对象返回值，成员同上。
		 */
		'executePreparedCall':function(sql, vtArray, success){

			if (arguments.length<2){
				alert("preparedCall 函数至少提供sql, fvObject参数!");
				return;
			}

			if (typeof (success) == 'undefined') {
				success = null;
			}

			var sqlParameter = {};

			if (this.SQLEncode==1){
				sqlParameter.sql = Base64.encode(sql);
				sqlParameter.sqlencode = "1";
			}
			else
				sqlParameter.sql = sql;

			var length = vtArray.length;
			for(var index=0; index<length; index=index+1){
				//如果提供参数，并且不为null，则传递到服务器方,否则不传递.服务器方自动设置null.
				//如果值为空，则设置为null
				if ( typeof(vtArray[index].value)!='undefined' && vtArray[index].value!=null)
					sqlParameter["value"+index] = vtArray[index].value;

				sqlParameter["dataType"+index] = vtArray[index].dataType;
			}

			sqlParameter.length = length+"";
			sqlParameter.command = "executeUpdate";

			var url= this.url;

			if (success==null){
				return fjs.AjaxRequest.postSync(url, sqlParameter);
			}else{
				fjs.AjaxRequest.postAsync(url, sqlParameter, success);
			}
		},

		/**
		 *  执行SQL语句，用于delete, update, insert.
		 * @param sql  单个SQL语句，不带占位符.
		 * @param success 提供success为异步调用。不提供为同步调用
		 * @returns {*|string}
		 */
		'executeUpdate':function(sql, success){

			if (typeof (success) == 'undefined') {
				success = null;
			}

			var sqlParameter = {};

			if (this.SQLEncode==1){
				sqlParameter.sql = Base64.encode(sql);
				sqlParameter.sqlencode = "1";
			}
			else
				sqlParameter.sql = sql;

			sqlParameter.command = "executeUpdate";

			var url= this.url;

			if (success==null){
				return fjs.AjaxRequest.postSync(url, sqlParameter);
			}else{
				fjs.AjaxRequest.postAsync(url, sqlParameter, success);
			}
		},

		/**
		 * insertTable
		 * 提供对插入操作的支持。一般用于字段比较多的情况。少字段的可以直接使用prepareCall,或者executeUpdate
		 *
		 * @param table 表名
		 * @param fvdArray 提供field,value,dataType.
		 * @param success
		 * @returns {*}
		 */
		'insertTable':function(table, fvdArray, success){
			if (arguments.length<2){
				alert("insert 函数至少提供table, fvdArray参数!");
				return;
			}

			if (typeof (success) == 'undefined') {
				success = null;
			}
			var sql = "";

			var fArray = new Array();
			var vArray = new Array();
			var fStr = "";
			var vStr = "";

			for(index=0; index<fvdArray.length; index=index+1){
				fArray[index] = fvdArray[index].field;
				vArray[index] = "?";
			}
			vStr = vArray.join(",");
			fStr = fArray.join(",");

			sql = "insert into " + table + "(" + fStr + ") values(" + vStr + ")";

			if (success==null)
				return this.executePreparedCall(sql, fvdArray);
			else
				this.executePreparedCall(sql, fvdArray, success);
		},

		/**
		 * updateTable
		 * 提供对更新操作的支持。一般用于字段比较多的情况。少字段的可以直接使用prepareCall,或者executeUpdate
		 *
		 * @param table 表名
		 * @param fvdArray 提供field,value,dataType.
		 * @param success
		 * @returns {*}
		 */
		'updateTable':function(table, fvdArray, condition, success){
			if (arguments.length<2){
				alert("update 函数至少提供table, fvdArray参数!");
				return;
			}

			if (typeof (condition) == 'undefined') {
				condition = "1=1";
			}

			if (typeof (success) == 'undefined') {
				success = null;
			}
			var sql = "";

			var fArray = new Array();

			for(var index=0; index<fvdArray.length; index=index+1){
				fArray[index] = fvdArray[index].field + "=?";
			}

			var fStr = fArray.join(",");

			sql = "update " + table + " set " + fStr + " where " + condition;

			if (success==null)
				return this.executePreparedCall(sql, fvdArray);
			else
				this.executePreparedCall(sql, fvdArray, success);
		}
	};
	
	
	//=====================SELECT标签=============================
	fjs.DropList = {
		'create':function(id, options){
			if (id=="" || typeof(id)!='undefined' ||id!=null)
				id = new Date().valueOf();
		
			var obj = $("<SELECT id='"+id+"'></SELECT>");

			if (typeof(options)!='undefined' && options!=null){
				this.addOption(obj, options);
			}
		
			return obj[0];
		},

		//e:标签对象
		//若value为对象，则为一个数组对象，提供value,text数组。
		//若value为字符串，则value,text单独作为一个option
		'addOption':function(e, value, text){
			var s = $(e);
		
			if (arguments.length==2){ //如果只有2个参数，则value 为options数组
				var options = value;
			
				for(var index=0; index<options.length; index=index+1){
					option = options[index];
					var html = "<OPTION value='{0}'>{1}</OPTION>";
					html = html.format(option.value, option.text);
					s.append(html);
				}		
			}
			else{
				var html = "<OPTION value='{0}'>{1}</OPTION>";
				html = html.format(value, text);
				s.append(html);	
			}
		}
	};
	
	window.FJS = fjs;
})();

















