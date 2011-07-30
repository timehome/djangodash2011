(function(global){

    global.getScript = function(url, filter){
        $.ajax({
            url: url,
            async: false,
            cache: false,
            dataType: 'text',
            success: function(text){
                if (filter instanceof Function){
                    text = filter(text);
                }
                $('<script>'+ text +'</script>').appendTo('head');
            }
        });
    };

})(this);
