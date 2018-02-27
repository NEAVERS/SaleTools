//闭包限定命名空间
(function ($) {
    $.fn.extend({
        "overlay":function(options){
        	var opts = $.extend({}, defaluts, options);
            // 初始渲染
        	$("body").append('<div class="overlay">\
        		<section class="wrapper">\
		            <p class="close"><img src="/statics/images/buyer/close-round.png" alt="" class="btn-close"></p>\
		            <p class="title"></p>\
		            <p class="contentt"></p>\
		            <p class="btn-box"><span class="ui-btn ui-btn-red btn-confirm">确定</span><span class="ui-btn ui-btn-gray btn-close">取消</span></p>\
		        </section>\
        		</div>\
        		');
            // 不同页面功能用不同的提示
            this.render(options.index);
            // 确定和取消对应不同的功能
            $('.btn-close').on('click',function(){
                $('.overlay').hide(300);
            });
            $('.btn-confirm').on('click',function(){                   
                options.confirmFunction(opts.product_id);
                $('.overlay').hide(300);       
            })
        	            
        },
        "render":function(i){
            var data = $.extend({}, defaluts, i);
            $('.overlay .wrapper .contentt').text(data.info[i].content);
            $('.overlay .wrapper .title').text(data.info[i].title);
            $('.overlay .wrapper .title').css("background","url(/statics/images/buyer/"+data.info[i].url+") no-repeat"); 
            $('.overlay').show(300);
        },
        "alertInfo":function(info,target){
             var render2='<div class="overlay">\
                <section class="wrapper">\
                    <p class="close"><img src="/statics/images/buyer/close-round.png" alt="" class="btn-close"></p>\
                    <p class="title"></p>\
                    <p class="contentt"></p>\
                    <p class="btn-box"><span class="ui-btn ui-btn-red btn-close">确定</span></p>\
                </section>\
                </div>\
                ';
            $('.overlay').remove();
            $("body").append(render2);
            $('.overlay .wrapper .title').text(info);
            if(target){
                $('.overlay .wrapper .title').css("background","url(/statics/images/buyer/"+"0116-01.png"+") no-repeat");
            }else{
                $('.overlay .wrapper .title').css("background","url(/statics/images/buyer/"+"0113-03.png"+") no-repeat");
            }            
            $('.overlay').show(300);
            $('.btn-close').on('click',function(){
                $('.overlay').hide(300);
            });
        }
    });
    //默认参数
    var defaluts = {
        info:[
            {content:"确定要上架商品吗？",title:"上架商品",url:"0113-01.png"},
            {content:"确定要下架商品吗？",title:"下架商品",url:"0113-01.png"},
            {content:"订单取消申请成功",title:"申请成功",url:"0113-02.png"},
            {content:"是否确认审核通过？",title:"审核通过",url:"0113-03.png"},
            {content:"是否确认打回？",title:"订单打回",url:"0113-03.png"},
        ]
    };
})(window.jQuery);