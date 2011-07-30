(function(global, $){

    var headerElement = $('header');

    header: {
        var header = new Header(headerElement);
        $(global).addListener('scroll', function(e){
            header.reactToScroll(e);
        });
    }

    albumsRequest: {
        var username = /(?:.+?)\/(.+)/.exec(window.location)[0];
        var request = new Request.JSON({
            url: '/'+ username +'.json'
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

            var counterFluid = 0;
            var wall = new Wall("wall", {
                draggable: true,
                inertia: true,
                width: 128,
                height: 128,
                rangex: [-images.length, images.length],
                rangey: [-images.length, images.length],
                callOnUpdate: function(items){
                    for (var i = 0, l = items.length; i < l; i++) {
                        var e = items[i];
                        var img = new Element('img');
                        img.addEvent('load', function(){
                            this.addClass('success');
                        }.bind(e.node));
                        img.addEvent('error', function(){
                            this.grab(document.createTextNode(':( was not possible to load this image'));
                            this.addClass('error');
                        }.bind(e.node));
                        img.set('src', images[counterFluid].thumbnail);
                        e.node.grab(img);

                        counterFluid++;
                        // Reset counter
                        if (counterFluid >= images.length) {
                            counterFluid = 0;
                        }
                    }
                }
            });
            wall.initWall();
        });
    }

    request.get();

}(this, document.id));

