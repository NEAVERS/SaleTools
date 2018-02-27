$(function(){
    var keywords = [];
    var keywordItems =[];
    var serachtimer;

    /**
     * 根据关键字获取关键词组
     */
    function searchKeywords (key, id, cl) {
        keywordItems = [];
        clearTimeout(serachtimer);
        serachtimer = setTimeout(function(){
            $.ajax({
                type: 'get',
                url: '/search/searchKeywords',
                dataType : 'json',
                data : {
                    keywords :key
                },
                success : function(result) {
                    // var result = [{id:1,keywords:22},{id:2,keywords:111}];
                    if ( result != "" ){
                        keywordItems = result;
                        // for (var k in result){
                        //     keywordItems.push(result[k].keywords);
                        // }
                        checkKeyWord (id, cl, keywordItems)
                    }
                },
                error : function(result) {
                    console.log(result)
                }
            });
        },800);

    }


    //设置cookie 值
    function  setCookie (name, value) {
        document.cookie = name + "=" + value + ";path=/;";
    }
    // setCookie("keywords","")
    // 获取cooKie值
    function getCookie (name) {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if( arr != null )return decodeURI(arr[2]); return "";
    }
    //关键词储存cooKie操作
    function setKeyword (keywords,query) {
        keywords.unshift(query);
        if ( keywords.length > 10 ) {
            keywords.pop();
        }
        for ( var k in keywords){
            if(keywords[k] == query && k >0){
                keywords.splice(k,1);
            }
        }
        setCookie('keywords',keywords.join(','));
    }
    //关键词匹配
    function checkKeyWord (id, cl, keywords) {
        var items = $( "." + cl );
        items.css("display","block");
        var parse = id.parent();
        var _html = "";
        _html += '<ul class="' + cl + '">';
        for (var k in keywords) {
            _html += '<li><a href="/search/index?q='+ keywords[k] + '">'+  keywords[k] + '</a></li>';
        }
        _html += "</ul>";
        if (!items.length) {
            parse.append(_html);
            $( "." + cl ).css("width",id.width());
        }
        else{
            var _htmlOne = "";
            for (var k in keywords) {
                _htmlOne += '<li><a href="/search/index?q='+ keywords[k] + '">'+  keywords[k] + '</a></li>';
            }
            items.html(_htmlOne);
        }
    }

    if ( getCookie("keywords") != ""){
        keywords = getCookie("keywords").split(',');
    }
    // 搜索
    $("#C_GlobalSearchInput").on("focus", function(){
        var _this = $(this),
            placeholder = _this.data("placeholder"),
            query = _this.val();
        if (query == placeholder) {
            _this.val("");
            _this.css({color:"#000000"});
        }
        else {
            searchKeywords(query, $("#C_GlobalSearchInput"), "checkKeywordsOne");
        }
        if ( getCookie("keywords") !="" &&  query == placeholder) {
            checkKeyWord ($("#C_GlobalSearchInput"), "checkKeywordsOne", keywords)
        }
    }).on("blur", function(){
        var _this = $(this),
            placeholder = _this.data("placeholder"),
            query = _this.val();
        query = $.trim(query);
        if (query == "") {
            _this.val(placeholder);
            _this.css({color:"#aaaaaa"});
        }

        setTimeout(function(){
            $(".checkKeywordsOne").css("display","none");
        },50)
    }).on("input", function () {
        var _this = $(this) ;
        var keys = _this.val();
        if(keys ==  ""){
            checkKeyWord ($("#C_GlobalSearchInput"), "checkKeywordsOne", keywords);
        }
        else {

                searchKeywords(keys, $("#C_GlobalSearchInput"), "checkKeywordsOne");
        }
    });
    $("#C_GlobalSearchForm").on("submit", function(){
        var _searchInput = $("#C_GlobalSearchInput"),
            placeholder = _searchInput.data("placeholder"),
            query = _searchInput.val();
        query = $.trim(query);
        if (query == placeholder) {
            _searchInput.val("");
        }
        else{
            setKeyword(keywords,query);
        }
        return true;
    });

    $("#C_GlobalSearchInputOne").on("focus", function(){
        var _this = $(this),
            placeholder = _this.data("placeholder"),
            query = _this.val();
        if (query == placeholder) {
            _this.val("");
            _this.css({color:"#000000"});
        }
        else {
            searchKeywords(query, $("#C_GlobalSearchInputOne"), "checkKeywordsTwo");
        }
        if ( getCookie("keywords") !="" ) {
            checkKeyWord ($("#C_GlobalSearchInputOne"), "checkKeywordsTwo", keywords)
        }
    }).on("blur", function(){
        var _this = $(this),
            placeholder = _this.data("placeholder"),
            query = _this.val();
        query = $.trim(query);
        if (query == "") {
            _this.val(placeholder);
            _this.css({color:"#aaaaaa"});
        }
        setTimeout(function(){
            $(".checkKeywordsTwo").css("display","none");
        },50)
    }).on("input", function () {//关键词搜索自动关联
        var _this = $(this) ;
        var keys = _this.val();
            if(keys ==  ""){
                checkKeyWord ($("#C_GlobalSearchInputOne"), "checkKeywordsTwo", keywords);
            }
            else {
                searchKeywords(keys, $("#C_GlobalSearchInputOne"), "checkKeywordsTwo");
            }
    });
    $("#C_GlobalSearchFormOne").on("submit", function(){
        var _searchInput = $("#C_GlobalSearchInputOne"),
            placeholder = _searchInput.data("placeholder"),
            query = _searchInput.val();
        query = $.trim(query);
        if (query == placeholder) {
            _searchInput.val("");
        }
        else{
            setKeyword(keywords,query);
        }
        return true;
    });
    // 购物车数量
    $(function(){
        // GlobalCartItemNum();
    });
    // 账户信息 tab
    $("a", "#C_AccountTabs").on("click", function(){
        var _this = $(this);
        if (_this.hasClass("current")) {
            return false;
        }
        var _li = _this.parent();
        var index = _li.index();
        _this.addClass("current");
        _li.siblings().children("a").removeClass("current");
        $(".account_item", "#C_AccountContents").each(function(i) {
            if (i == index) {
                $(this).addClass("show_elem");
                $(this).siblings().removeClass("show_elem");
                return false;
            }
        });
        return false;
    });
    // 导航下拉
    $("#C_CategoryBox").on("mouseenter", function(){
        $(this).addClass("show");
    }).on("mouseleave", function(){
        $(this).removeClass("show");
    });
    $("#C_CategoryList").on("mouseenter", function(){
        var _cbox = $("#C_CategoryBox");
        var fixed = parseInt(_cbox.data("fixed"));
        if (fixed === 1) {
            _cbox.removeClass("fixed");
        }
    }).on("mouseleave", function(){
        var _cbox = $("#C_CategoryBox");
        var fixed = parseInt(_cbox.data("fixed"));
        if (fixed === 1) {
            _cbox.addClass("fixed");
        }
    });

    function menuInit() {
        var fixed = parseInt($("#C_CategoryBox").data("fixed"));
        if (fixed == 1) {
            $("#C_CategoryBox").addClass("fixed");
        }
    }

    menuInit();
});

function GlobalCartItemNum() {
    $.get("/cart/getShopCartNumber", function(data){
        $("#C_GlobalCartItemNum").html(data);
        $("#C_GlobalCartItemNum_fixed").html(data);
    });
}