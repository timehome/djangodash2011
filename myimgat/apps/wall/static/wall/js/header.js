(function(global, $){

    var Header = this.Header = new Class({
        initialize: function(element){
            this.element = $(element);
        },
        reactToScroll: function(e){
            var scrolledElement = $(e.target);
            if (scrolledElement.getScrollSize().y != 0) {
                this.element.addClass();
            }
        }
    });

    var header = new Header('header');
    $(global).addListener('scroll', function(e){
        header.reactToScroll(e);
    });

}(this, document.id));
