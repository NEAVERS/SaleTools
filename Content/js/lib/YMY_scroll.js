(function($){

	$.fn.YMY_scroll=function(option){

		//基础配置
		var base_option={
			"prevClassName":"prev",
			"nextClassName":"next",
			"showNumber":5,
			"offset":0,
			"auto":true,
			"autoTime":5000
		};

		//合并配置文件
		for(val in base_option){
			if(!option[val]){
				option[val]=base_option[val];
			}
		}

		//获取容器中的数量
		var length=$(this).find("li").length;

		//总共切换次数
		number_all=Math.ceil(length/option.showNumber);

		//获取item的宽度
		var item={};
		item.width=$(this).find("li").width()+option.offset;

		//需移动的数据
		var moveDistance=option.showNumber*item.width;

		//绑定事件
		var nowDistance=0;	
		var dom=$(this);
		$("."+option.nextClassName).on("click",function(){
				deffterScroll();
				if(nowDistance==-(number_all-1)*moveDistance){
					return false;
				}
				nowDistance-=moveDistance;
				var number=nowDistance+"px";
				dom.stop().animate({left:number},1000);

		});
		$("."+option.prevClassName).on("click",function(){
			deffterScroll();
			if(nowDistance==0){
				return false;
			}
			nowDistance+=moveDistance;
			var number=nowDistance+"px";
			dom.stop().animate({left:number},1000);
		});

		var autoScroll=function(){
			interval=setInterval(function(){
				if(nowDistance==-(number_all-1)*moveDistance){
					dom.animate({left:"0px"},1000);
					nowDistance=0;
				}else{
					nowDistance-=moveDistance;
					var number=nowDistance+"px";
					dom.animate({left:number},1000);				
				}
			},option.autoTime);
		}

		//延迟轮播
		var deffterScroll=function(){
			clearInterval(interval);
			autoScroll();
		}

		//开启自动
		var interval;
		if(option.auto){
			autoScroll();
		}

	}

})(jQuery);