(function(){

    $.help = $.help || {};

    $.extend($.help, {
        /**
         * 载入css文件
         */
        loadCss: function(src){
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = src;
            document.getElementsByTagName("head").item(0).appendChild(link);
        },
        /**
         * 获取最后一个script文件信息
         * @return {[type]} [description]
         */
        lastScriptFileInfo: function(){
            var last_script_file = document.scripts[document.scripts.length - 1].src
            var last_script_path = last_script_file.substring(0, (last_script_file.lastIndexOf("/") + 1));
            var last_script_filename = last_script_file.replace(last_script_path, "");

            return {
                path: last_script_path,
                filename: last_script_filename
            };
        }
    });

})(jQuery)