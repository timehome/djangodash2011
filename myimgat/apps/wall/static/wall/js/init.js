(function(global, $){

    var headerElement = $('header');

    header: {
        var header = new Header(headerElement);
        $(global).addListener('scroll', function(e){
            header.reactToScroll(e);
        });
    }

    albumsRequest: {
        var username = "";
        username = window.location.href.match(/\/([^/]+)$/);
        if (username){
            username = username[1];
        } else if (global.settings.authUsername) {
            username = global.settings.authUsername;
        } else {
            username = global.settings.defaultUsername;
        }
        var request = new Request.JSON({
            url: '/api/'+ username +'.json'
        });
    }

    wall: {
        var navigation = headerElement.getElement('nav');
        var images = [];
        //var albumsFirstIndexes = {};

        request.addEvent('onSuccess', function(albums){
            for (var i = 0; i < albums.length; i++) {
                navigation.grab(new Element('a', {href: '#', html: albums[i].title}));
                images.push.apply(images, albums[i].photos);
            };

            var wallSideSize = Math.sqrt(images.length);
            var rangeSize = Math.max(Math.ceil(wallSideSize / 2), 16);

            var counterFluid = 0;
            var wall = new Wall("wall", {
                draggable: true,
                inertia: true,
                width: 128,
                height: 128,
                rangex: [-rangeSize, rangeSize],
                rangey: [-rangeSize, rangeSize],
                callOnUpdate: function(items){
                    for (var i = 0, l = items.length; i < l; i++) {
                        var placeholder = items[i].node;
                        var image = images[counterFluid % images.length];
                        var img = new Element('img');

                        img.addEvent('load', function(){
                            this.addClass('success');
                        }.bind(placeholder));
                        img.addEvent('error', function(){
                            this.grab(document.createTextNode(':( was not possible to load this image'));
                            this.addClass('error');
                        }.bind(placeholder));
                        img.addEvent('dblclick', function(){
                            location.href = username + '/photos/'+ image.url;
                        });
                        img.set('src', image.thumbnail);
                        placeholder.grab(img);

                        counterFluid++;
                    }
                }
            });
            wall.initWall();
        });
    }

    request.get();

    overlay: {
        var overlay = new Overlay();
    }

    popin: {
        if (!settings.authUsername) {
            var popin = new Popin('simple-popin');
            popin.show('login');
        }
    }

}(this, document.id));

