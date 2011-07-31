(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        initialize: function(){
            this.parent.apply(this, arguments);
            this.bindEvents();
            this.createRequest();
        },

        createRequest: function(){
            this.request = new Request.JSON({
                url: settings.urls.shorten
            });
        },

        bindEvents: function() {
            this.shareButton = this.element.getElement('.share-button');
            this.token = this.element.getElement('[name="csrfmiddlewaretoken"]');
            this.shareButton.addEvent('click', this.share.bind(this));
        },

        share: function(e) {
            e.preventDefault();
            var data = Object.clone(this.shareButton.retrieve('crop-info'));
            data[this.token.get('name')] = this.token.get('value');
            this.request.addEvent('success', function() {
                console.log('sucesso');
            }).post(data);
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

