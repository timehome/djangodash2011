(function(global){

    header: {
        var header = new Header('header');
        $(global).addListener('scroll', function(e){
            header.reactToScroll(e);
        });
    }

}(this));

