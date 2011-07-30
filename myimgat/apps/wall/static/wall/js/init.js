(function(global){

    header: {
        var header = new Header('header');
        $(global).addListener('scroll', function(e){
            header.reactToScroll(e);
        });
    }

    wall: {
        var counterFluid = 0;
        var wall = new Wall("wall", {
            draggable: true,
            inertia: true,
            width: 128,
            height: 128,
            rangex: [-images.length, images.length],
            rangey: [-images.length, images.length],
            callOnUpdate: function(items){
                items.each(function(e, i){
                    var img = new Element('img', {
                        src: images[counterFluid]
                    }).inject(e.node).fade("hide").fade("in");

                    counterFluid++;
                    // Reset counter
                    if (counterFluid >= images.length) {
                        counterFluid = 0;
                    }
                });
            }
        });
        wall.initWall();
    }

}(this));

