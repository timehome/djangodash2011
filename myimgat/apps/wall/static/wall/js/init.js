(function(global, $){

    var headerElement = $('header');

    cropPopin: {
        var cropPopin = new CropPopin('crop-popin', {
            onHide: function(){
                overlay.hide();
            }
        });
        cropPopin.addEvent('onCropActive', function(image){
            this.element.getElement('h2').set('text', image.title);
            var photoContainer = this.element.getElement('.photo');
            var photo = new Element('img', {
                events: {
                    load: function(){
                        var size = this.getSize();
                        new MooCrop(this, {
                            initialCrop: {
                                top: 0,
                                left: 0,
                                width: size.x - 2,
                                height: size.y - 2 
                            },
                            min: {width: 50, height: 50},
                            maskColor: '#ddd',
                            maskOpacity: 0.2,
                            constrainRatio: false,
                            handleColor: '#ccc',
                            cropBorder: 'dashed 1px #000',
                            onComplete: function(){
                                //console.log(this, arguments);
                            }
                        });
                    }
                }
            });
            photo.set('src', image.crop_url);
            photoContainer.empty().grab(photo);
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
                        var img = new Element('img', {
                            events: {
                                'load':function(){
                                    this.addClass('success');
                                }.bind(placeholder),

                                'error': function(){
                                    this.addClass('error');
                                }.bind(placeholder),

                                'dblclick': function(image){
                                    this.show('crop').fireEvent('cropActive', [image]);
                                    overlay.show();
                                }.bind(cropPopin, image)
                            }
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
        var overlay = new Overlay({
            onClose: function(){
                cropPopin.hide();
            }
        });
    }

    popin: {
        if (!settings.authUsername && !urlUsername) {
            var popin = new Popin('simple-popin', {closeButton: false});
            popin.show('login');
        }
    }

}(this, document.id));

