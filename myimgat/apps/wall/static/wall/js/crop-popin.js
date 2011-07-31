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

                var twitter = '<div class="social-item"><a target="_blank" title="tweet this image" href="http://twitter.com/share?url=' + shareUrl + '&via=myimgat&text=' + self.image.title + '" class="twitter-share-button"><img src="/static/wall/img/tweetn.png" alt="tweet this image" /></a></div>';
                var gplus = '<div class="social-item"><g:plusone href="url"></g:plusone></div>';
                var fbLike = '<div class="social-item"><iframe src="http://www.facebook.com/plugins/like.php?app_id=102452659856143&amp;href=' + shareUrl + '&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:80px; margin-left:10px;" allowTransparency="true"></iframe></div>';
                var fbSend = '<div class="social-item"><div id="fb-root"></div><script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script><fb:send href="' + shareUrl + '" font="arial"></fb:send></div>';

                self.socials.set('html', twitter + gplus + fbLike + fbSend);

                gapi.plusone.go();

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

