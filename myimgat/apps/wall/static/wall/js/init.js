(function(global, $){

    var headerElement = $('header');

    cropPopin: {
        var cropPopin = new CropPopin('crop-popin');
        cropPopin.addEvent('tabChange', function(){
            console.log(this, arguments);
        });
    }

    albumsRequest: {
        var username;
        var urlUsername = window.location.href.match(/\/([^/]+)$/);
        if (urlUsername) {
            username = urlUsername = urlUsername[1];
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
        var navigation = headerElement.getElement('nav.albums');
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

                        img.addEvents({
                            'load':function(){
                                this.addClass('success');
                            }.bind(placeholder),

                            'error': function(){
                                this.grab(document.createTextNode(':( was not possible to load this image'));
                                this.addClass('error');
                            }.bind(placeholder),

                            'dblclick': cropPopin.show.bind(cropPopin)
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
        if (!settings.authUsername && !urlUsername) {
            var popin = new Popin('simple-popin', {closeButton: false});
            popin.show('login');
        }
    }

}(this, document.id));

