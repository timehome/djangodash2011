(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        initialize: function(){
            this.parent.apply(this, arguments);
            this.bindEvents();
        },

        bindEvents: function() {
            this.shareButton = this.element.getElement('.share-button');
            this.shareButton.addEvent('click', this.share.bind(this));
        },

        share: function(e) {
            e.preventDefault();
            new Request.JSON({
                url: settings.urls.shorten
            });
            //this.shareButton.
        },

        show: function(tab) {
            this.fireEvent('show');
            if (tab) {
                this.showTab(tab);
            }
            this.element.addClass('show');
            return this;
        },

        hide: function() {
            this.fireEvent('hide').element.removeClass('show');
            return this;
        }
    });

}(this, document.id));

