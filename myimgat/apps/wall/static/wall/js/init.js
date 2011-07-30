(function(global){

    var header = new Header('header');
    $(global).addListener('scroll', function(e){
        header.reactToScroll(e);
    });

}(this));

