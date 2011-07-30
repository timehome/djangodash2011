(function(global, $){

    var Header = this.Header = new Class({
        Implements: Options,
        options: {
            scrollingClassName: 'scrolling'
        },
        initialize: function(element){
            this.element = $(element);
        },
        reactToScroll: function(e){
            var scrolledElement = $(e.target);
            this.element[(scrolledElement.getScroll().y === 0) ? 'removeClass' : 'addClass'](this.options.scrollingClassName);
        }
    });

}(this, document.id));
