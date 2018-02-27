(function($){
    var ajax_url = "http://"+DOMAIN.ajax+"/category/getChildrenList";
    var tpl_header_str = "<div class=\"wgt_category_select_hd\"><div class=\"wgt_city_title\">请选择类目</div><i class=\"iconfont\">&#xe607;</i></div>";
    var tpl_body_str = "<div class=\"wgt_category_select_bd\"><div class=\"wgt_category_select_tabs\"><a class=\"wgt_category_select_tab cur\" href=\"javascript:;\">一级类目</a><a class=\"wgt_category_select_tab\" href=\"javascript:;\">二级类目</a><a class=\"wgt_category_select_tab\" href=\"javascript:;\">三级类目</a></div><div class=\"wgt_category_select_content wgt_category_select_content_show\"><dl><dd class=\"clearfix\"></dd></dl></div><div class=\"wgt_category_select_content\"><dl><dd class=\"clearfix\"></dd></dl></div><div class=\"wgt_category_select_content\"><dl><dd class=\"clearfix\"></dd></dl></div><input type=\"hidden\" name=\"fst_cat_id\" value=\"0\"><input type=\"hidden\" name=\"snd_cat_id\" value=\"0\"><input type=\"hidden\" name=\"thd_cat_id\" value=\"0\"></div>";
    var category_cache = {};
    var type = $('#J_CategorySelector').data('type');
    type = type == undefined ? '' : type;
    
    $.fn.CategorySelector = function(options){
        // 配置参数
        $.extend($.fn.CategorySelector.configs, options);
        
        // 容器
        $.fn.CategorySelector.container = this;

        // 模式
        $.fn.CategorySelector.multMode = this.length > 1 ? true : false;

        // 初始化
        $.fn.CategorySelector.initialize();
    }

    $.extend($.fn.CategorySelector, {
        /**
         * 容器
         */
        container: null,
        /**
         * 多模式
         */
        multMode: false,
        /**
         * 默认配置参数
         */
        configs: {
            afterFstSelect: function(cid){},
            afterSndSelect: function(cid){},
            afterThdSelect: function(cid){}
        },
        /**
         * 初始化
         */
        initialize: function() {
            // 创建元素
            this.createElements();
            // 绑定事件
            this.bindEvents();
            // 创建模板
            this.template();
            // 类目初始化
            this.categoryInit();
        },
        /**
         * 创建元素
         */
        createElements: function(){
            var that = this;

            $(this.container).each(function(index){
                var fid = parseInt($(this).data("fid"));
                var sid = parseInt($(this).data("sid"));
                var tid = parseInt($(this).data("tid"));

                fid = isNaN(fid) ? 0 : fid;
                sid = isNaN(sid) ? 0 : sid;
                tid = isNaN(tid) ? 0 : tid;

                that.elements[index] = {};

                that.elements[index].header = $("<div>", {"class": "wgt_category_select_hd"});
                that.elements[index].title = $("<div>", {"class": "wgt_category_title", "text": "请选择类目"});
                that.elements[index].icon = $("<i>", {"class": "iconfont", "html": "&#xe607;"});

                that.elements[index].body = $("<div>", {"class": "wgt_category_select_bd"});
                that.elements[index].tabs = $("<div>", {"class": "wgt_category_select_tabs"});
                that.elements[index].ftab = $("<a>", {"class": "wgt_category_select_tab cur", "href": "javascript:;", "text": "一级类目"});
                that.elements[index].stab = $("<a>", {"class": "wgt_category_select_tab", "href": "javascript:;", "text": "二级类目"});
                that.elements[index].ttab = $("<a>", {"class": "wgt_category_select_tab", "href": "javascript:;", "text": "三级类目"});
                that.elements[index].contents = $("<div>", {"class": "wgt_category_select_contents"});
                that.elements[index].fcontent = $("<div>", {"class": "wgt_category_select_content wgt_category_select_content_show"});
                that.elements[index].scontent = $("<div>", {"class": "wgt_category_select_content"});
                that.elements[index].tcontent = $("<div>", {"class": "wgt_category_select_content"});
                that.elements[index].fdl = $("<dl>");
                that.elements[index].fdd = $("<dd>", {"class": "clearfix"});
                that.elements[index].sdl = $("<dl>");
                that.elements[index].sdd = $("<dd>", {"class": "clearfix"});
                that.elements[index].tdl = $("<dl>");
                that.elements[index].tdd = $("<dd>", {"class": "clearfix"});

                if (that.multMode) {
                    that.elements[index].fhidden = $("<input>", {"type": "hidden", "name": "fst_cat_id_"+index, "value": fid});
                    that.elements[index].shidden = $("<input>", {"type": "hidden", "name": "snd_cat_id_"+index, "value": sid});
                    that.elements[index].thidden = $("<input>", {"type": "hidden", "name": "thd_cat_id_"+index, "value": tid});
                }
                else {
                    that.elements[index].fhidden = $("<input>", {"type": "hidden", "name": "fst_cat_id", "value": fid});
                    that.elements[index].shidden = $("<input>", {"type": "hidden", "name": "snd_cat_id", "value": sid});
                    that.elements[index].thidden = $("<input>", {"type": "hidden", "name": "thd_cat_id", "value": tid});
                }
            });
        },
        // 事件绑定
        bindEvents: function() {
            var that = this;

            $(this.container).each(function(index){
                var elements = that.elements[index];

                // 显示内容
                elements.header.on("click", function(){
                    elements.body.css({"display": "block"});
                });

                // tabs
                elements.ftab.on("click", function(){
                    if ($(this).hasClass("cur")) {
                        return false;
                    }
                    that.tabShow(index, 1);
                });
                elements.stab.on("click", function(){
                    if ($(this).hasClass("cur")) {
                        return false;
                    }
                    that.tabShow(index, 2);
                });
                elements.ttab.on("click", function(){
                    if ($(this).hasClass("cur")) {
                        return false;
                    }
                    that.tabShow(index, 3);
                });

                // content dd a
                elements.fdd.on("click", "a", function(){
                    var _this = $(this);
                    if (!_this.hasClass("cur")) {
                        var cid = _this.data("id");
                        elements.sdd.html("");
                        elements.tdd.html("");
                        elements.shidden.val(0);
                        elements.shidden.data("name", "");
                        elements.thidden.val(0);
                        elements.thidden.data("name", "");

                        that.getCategoryList(cid, function(result){
                            var html_str = "";
                            for (var k in result) {
                                html_str += "<a href=\"javascript:;\" data-id=\"" + result[k].Id + "\">" + result[k].TypeName+"</a>";
                            }

                            elements.sdd.html(html_str);
                            _this.addClass("cur");
                            _this.siblings("a").removeClass("cur");
                            elements.fhidden.val(cid);
                            elements.fhidden.data("name", _this.text());
                            that.tabShow(index, 2);
                            that.tipShow(index);

                            // callback
                            that.configs.afterFstSelect(cid);
                        });
                    }
                    return false;
                });
                elements.sdd.on("click", "a", function(){
                    var _this = $(this);
                    if (!_this.hasClass("cur")) {
                        var cid = _this.data("id");
                        elements.tdd.html("");
                        elements.thidden.val(0);
                        elements.thidden.data("name", "");

                        that.getCategoryList(cid, function(result){
                            var html_str = "";
                            for (var k in result) {
                                html_str += "<a href=\"javascript:;\" data-id=\"" + result[k].Id + "\">" + result[k].TypeName+"</a>";
                            }

                            elements.tdd.html(html_str);
                            _this.addClass("cur");
                            _this.siblings("a").removeClass("cur");
                            elements.shidden.val(cid);
                            elements.shidden.data("name", _this.text());
                            that.tabShow(index, 3);
                            that.tipShow(index);

                            // callback
                            that.configs.afterSndSelect(cid);
                        });
                    }
                    return false;
                });
                elements.tdd.on("click", "a", function(){
                    var _this = $(this);
                    var cid = _this.data("id");

                    _this.addClass("cur");
                    _this.siblings("a").removeClass("cur");
                    elements.thidden.val(cid);
                    elements.thidden.data("name", _this.text());

                    that.tipShow(index);

                    // callback
                    that.configs.afterThdSelect(cid);
                });

            });

            // 隐藏
            $(document.body).on("click", function(e){
                var current_index = -1;
                var is_find = false;
                for (var key in that.elements) {
                    for (var k in that.elements[key]) {
                        if (that.elements[key][k][0] === e.target) {
                            current_index = parseInt(key);
                            is_find = true;
                            break;
                        }
                    }
                    if (is_find) {
                        break;
                    }
                }
                $(that.container).each(function(index){
                    if (index == current_index) {
                        return true;
                    }
                    that.elements[index].body.css({"display": "none"});
                });
            });

        },
        /**
         * 创建模板
         */
        template: function() {
            var that = this;

            $(this.container).each(function(index){
                $(this)
                    .append(
                        that.elements[index].header
                            .append(that.elements[index].title)
                            .append(that.elements[index].icon)
                    )
                    .append(
                        that.elements[index].body
                            .append(
                                that.elements[index].tabs
                                    .append(that.elements[index].ftab)
                                    .append(that.elements[index].stab)
                                    .append(that.elements[index].ttab)
                            )
                            .append(
                                that.elements[index].contents
                                    .append(
                                        that.elements[index].fcontent
                                            .append(
                                                that.elements[index].fdl.append(that.elements[index].fdd)
                                            )
                                    )
                                    .append(
                                        that.elements[index].scontent
                                            .append(
                                                that.elements[index].sdl.append(that.elements[index].sdd)
                                            )
                                    )
                                    .append(
                                        that.elements[index].tcontent
                                            .append(
                                                that.elements[index].tdl.append(that.elements[index].tdd)
                                            )
                                    )
                            )
                            .append(that.elements[index].fhidden)
                            .append(that.elements[index].shidden)
                            .append(that.elements[index].thidden)
                    );
            });
        },
        /**
         * 节点元素
         */
        elements: {},
        /**
         * tab切换
         */
        tabShow: function(index, mode){
            var elements = this.elements[index];
            if (elements == undefined) {
                return false;
            }
            switch (mode) {
                case 1:
                    elements.ftab.addClass("cur");
                    elements.stab.removeClass("cur");
                    elements.ttab.removeClass("cur");
                    elements.fcontent.addClass("wgt_category_select_content_show");
                    elements.scontent.removeClass("wgt_category_select_content_show");
                    elements.tcontent.removeClass("wgt_category_select_content_show");
                    break;
                case 2:
                    elements.ftab.removeClass("cur");
                    elements.stab.addClass("cur");
                    elements.ttab.removeClass("cur");
                    elements.fcontent.removeClass("wgt_category_select_content_show");
                    elements.scontent.addClass("wgt_category_select_content_show");
                    elements.tcontent.removeClass("wgt_category_select_content_show");
                    break;
                case 3:
                    elements.ftab.removeClass("cur");
                    elements.stab.removeClass("cur");
                    elements.ttab.addClass("cur");
                    elements.fcontent.removeClass("wgt_category_select_content_show");
                    elements.scontent.removeClass("wgt_category_select_content_show");
                    elements.tcontent.addClass("wgt_category_select_content_show");
                    break;
            }
            return true;
        },
        /**
         * 显示提示
         */
        tipShow: function(index) {
            var elements = this.elements[index];
            if (elements == undefined) {
                return false;
            }

            var tip = "";
            var fname = $.trim(elements.fhidden.data("name"));
            var sname = $.trim(elements.shidden.data("name"));
            var tname = $.trim(elements.thidden.data("name"));

            if (fname.length > 0) {
                tip += fname;
                if (sname.length > 0) {
                    tip += "<span style=\"color:#cccccc;\">&nbsp;/&nbsp;</span>" + sname;
                    if (tname.length > 0) {
                        tip += "<span style=\"color:#cccccc;\">&nbsp;/&nbsp;</span>" + tname;
                    }
                }

                elements.title.addClass("wgt_city_title_select").html(tip);
            }

            return true;
        },
        /**
         * 类目初始化
         */
        categoryInit: function(){
            var that = this;

            this.getCategoryList(0, function(result){
                $(that.container).each(function(index){
                    var elems = that.elements[index];
                    var fid = result[0].Id;
                    var html = "";
                    var cur_class = "";


                    for (var k in result) {
                        cur_class = "";
                        if (result[k].Id == fid) {
                            cur_class = "class=\"cur\"";
                            elems.fhidden.data("name", result[k].TypeName);
                        }
                        html += "<a href=\"javascript:;\" " + cur_class + " data-id=\"" + result[k].Id + "\">" + result[k].TypeName+"</a>";
                    }

                    elems.fdd.html(html);
                    that.tipShow(index);
                    
                    if (fid != "") {
                        // callback
                        that.configs.afterFstSelect(fid);

                        // 初始化二级类目
                        that.getCategoryList(fid, function(result){
                            var sid = result[0].Id;;
                            var html = "";
                            var cur_class = "";


                            for (var k in result) {
                                cur_class = "";
                                if (result[k].Id == sid) {
                                    cur_class = "class=\"cur\"";
                                    elems.shidden.data("name", result[k].TypeName);
                                }
                                html += "<a href=\"javascript:;\" " + cur_class + " data-id=\"" + result[k].Id + "\">" + result[k].TypeName+"</a>";
                            }

                            elems.sdd.html(html);
                            that.tipShow(index);
                            that.tabShow(index, 2);

                            if (sid !="") {
                                // callback
                                that.configs.afterSndSelect(sid);

                                // 初始化三级类目
                                that.getCategoryList(sid, function(result){
                                    var tid = parseInt(elems.thidden.val());
                                    var html = "";
                                    var cur_class = "";

                                    tid = isNaN(tid) ? 0 : tid;

                                    for (var k in result) {
                                        cur_class = "";
                                        if (result[k].Id == tid) {
                                            cur_class = "class=\"cur\"";
                                            elems.thidden.data("name", result[k].TypeName);
                                        }
                                        html += "<a href=\"javascript:;\" " + cur_class + " data-id=\"" + result[k].Id + "\">" + result[k].TypeName+"</a>";
                                    }

                                    elems.tdd.html(html);
                                    that.tipShow(index);
                                    that.tabShow(index, 3);

                                    // callback
                                    that.configs.afterThdSelect(tid);
                                });
                            }
                        });
                    }

                });
            });
        },
        /**
         * 获取类目信息列表
         */
        getCategoryList: function(parent_id, callback){
            if (category_cache[parent_id] != undefined) {
                callback(category_cache[parent_id]);
            }
            else {
                $.ajax({
                    "type": "POST",
                    "url": "/GoodsManager/GetGoodsTypeList",
                    "dataType": "json",
                    "data": {
                        "id": parent_id,
                        "type" : type
                    },
                    "success": function(result) {
                        category_cache[parent_id] = result;
                        callback(result);
                    }
                });
            }
        }
    });

    // load css file
    var script_file_info = $.help.lastScriptFileInfo();
    var css_filename = script_file_info.filename.replace(".js", ".css");
    var css_file = script_file_info.path + css_filename;
    $.help.loadCss(css_file);

})(jQuery);