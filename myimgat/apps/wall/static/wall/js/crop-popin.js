(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        initialize: function(){
            this.parent.apply(this, arguments);
            this.bindEvents();
            this.createRequest();
        },

        createRequest: function(){
            this.request = new Request({
                url: settings.urls.shorten
            });
        },

        bindEvents: function() {
            this.shareButton = this.element.getElement('.share-button');
            this.token = this.element.getElement('[name="csrfmiddlewaretoken"]');
            this.shareButton.addEvent('click', this.share.bind(this));
            this.shareArea = this.element.getElement('div.share-details');
            this.croppedLink = this.element.getElement('a.url');
            this.embedURL = this.element.getElement('span.url');
            this.embedTitle = this.element.getElement('span.title');
            this.embedComments = this.element.getElement('span.comment-page');
            this.socials = this.element.getElement('div.socials');
        },

        share: function(e) {
            var self = this;
            e.preventDefault();
            var data = Object.clone(this.shareButton.retrieve('crop-info'));
            data["id"] = this.image.id;
            data[this.token.get('name')] = this.token.get('value');
            this.request.addEvent('success', function(url) {
                var shareUrl = 'http://myimg.at/shared_photo/' + self.image.id;
                self.croppedLink.set('href', url);
                self.croppedLink.set('text', self.image.title);
                self.embedURL.set('text', url);
                self.embedTitle.set('text', self.image.title);
                self.embedComments.set('text', shareUrl);
                self.socials.empty();
                self.socials.set('html', '<a target="_blank" href="http://twitter.com/share?url=' + shareUrl + '&via=myimgat&text=' + self.image.title + '" class="twitter-share-button">tweet this image</a>');
                self.shareArea.fade('in');
            }).post(data);
        },

        show: function(tab) {
            this.fireEvent('show');
            if (tab) {
                this.showTab(tab);
            }
            this.element.addClass('show');
            this.shareArea.fade('out');
            return this;
        },

        hide: function() {
            this.fireEvent('hide').element.removeClass('show');
            return this;
        }
    });

}(this, document.id));

