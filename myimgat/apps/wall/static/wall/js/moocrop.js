/***
 * MooCrop (v. 1.2 - 2008-08-31 )
 *
 * @version         rc-1
 * @license         BSD-style license
 * @author          nwhite - < nw [at] nwhite.net >
 * @infos           http://www.nwhite.net/MooCrop/
 * @copyright           Author
 *
 * Modifications made by Rok - rokmail [at] gmail.com
 * 1. Ported for MooTools 1.2
 * 2. Ratio constraints added
 */

var MooCrop = new Class({
    Implements: [Events, Options],

    calculateHandles : true,
    current : {},

    options : {
        maskColor : 'black',
        maskOpacity : '.4',
        handleColor : 'blue',
        handleWidth : '8px',
        handleHeight : '8px',
        cropBorder : '1px dashed blue',
        min : { 'width' : 50, 'height' : 50 },
        showMask : true, // false to remove, helps on slow machines
        showHandles : false, // hide handles on drag
        constrainRatio : true // hide handles on drag
    },

    initialize: function(el, options){
        this.setOptions(options);
        this.img = $(el);
        if ( this.img.get('tag') != 'img') return false;
        this.resizeFunc = this.refresh.bindWithEvent(this);
        this.removeFunc = this.removeListener.bind(this);

        this.buildOverlay();
        this.setup();
    },

    setup: function(){
        $(this.cropArea).setStyles({
            'width': this.options.min.width,
            'height': this.options.min.height,
            'top' : (this.imgsize.height - this.options.min.height)/2,
            'left': (this.imgsize.width - this.options.min.width) / 2
        });

        this.current.crop = this.crop = this.getCropArea();

        this.handleWidthOffset = this.options.handleWidth.toInt() / 2;
        this.handleHeightOffset = this.options.handleHeight.toInt() /2;

        this.fixBoxModel();
        this.drawMasks();
        this.positionHandles();
    },

    getCropArea : function(){
        var crop = this.cropArea.getCoordinates();
        crop.left -= this.offsets.x; crop.right -= this.offsets.x; // calculate relative (horizontal)
        crop.top -= this.offsets.y; crop.bottom  -= this.offsets.y; // calculate relative (vertical)
        return crop;
    },

    fixBoxModel : function(){
        var diff = this.boxDiff = (this.crop.width - this.options.min.width)/2;
        var b = this.bounds = { 'top' : diff, 'left' : diff,
            'right' : this.imgsize.width+(diff*2), 'bottom' : this.imgsize.height+(diff*2),
            'width' : this.options.min.width+(diff*2), 'height' : this.options.min.height+(diff*2) };

        this.wrapper.setStyles({
            'width' : b.right, 'height' : b.bottom,
            'background' : 'url('+this.img.src+') no-repeat '+diff+'px '+diff+'px'
        });
        this.north.setStyle('width',b.right);
        this.south.setStyle('width',b.right);
    },

    activate : function(event,handle){
        event.stop();
        this.current = { 'x' : event.page.x, 'y' : event.page.y, 'handle' : handle, 'crop' : this.current.crop };
        if(this.current.handle == 'NESW' && !this.options.showHandles) this.hideHandles();
        this.fireEvent('onBegin',[this.img.src,this.getCropInfo(),this.bounds,handle]);
        document.addListener('mousemove', this.resizeFunc);
        document.addListener('mouseup', this.removeFunc);
    },

    removeListener : function(){
        if( this.current.handle == 'NESW' && !this.options.showHandles) this.showHandles();
        document.removeListener('mousemove', this.resizeFunc);
        document.removeListener('mouseup', this.removeFunc);
        this.crop = this.current.crop;
        this.fireEvent('onComplete',[this.img.src,this.getCropInfo(),this.bounds,this.current.handle]);
    },

    refresh : function(event){
        var pageX = event.clientX + $(document.body).getScroll().x;
        var pageY = event.clientY + $(document.body).getScroll().y;
        var xdiff = this.current.x - pageX;
        var ydiff = this.current.y - pageY;
        var b = this.bounds;
        var c = this.crop;
        var handle = this.current.handle;
        var styles = {}; //saving bytes
        var dragging = (handle.length > 2) ? true : false;
        if (dragging) {
            if(c.bottom - ydiff > b.bottom ) ydiff = c.bottom - b.bottom; // box south
            if(c.top - ydiff < b.top ) ydiff = c.top; //box north
            if(c.right - xdiff > b.right) xdiff = c.right - b.right; //box east
            if(c.left - xdiff < b.left) xdiff = c.left; //box west
            styles.top = c.top - ydiff;
            styles.left = c.left - xdiff;
        } else {
                    if( handle.contains("S") && !handle.contains("W") && !handle.contains("E")) {//SOUTH
                        if(c.bottom - ydiff > b.bottom ) ydiff = c.bottom - b.bottom; // box south
                        if( (c.height - ydiff) < b.height ) ydiff = c.height - b.height; // size south
                        if (this.options.constrainRatio) {
                            if(c.right - ydiff > b.right ) {
                                ydiff = c.right - b.right;
                                xdiff = ydiff;
                                styles.width = c.width - xdiff;
                                styles.height = c.height - ydiff;
                            } else {
                                styles.width = c.width - ydiff;
                                styles.height = c.height - ydiff;
                            }
                        } else {
                            styles.height = c.height - ydiff;
                        }
                    } else

                    if( handle.contains("N") && !handle.contains("W") && !handle.contains("E")) {//NORTH
                        if(c.top - ydiff < b.top ) ydiff = c.top; //box north
                        if( (c.height + ydiff ) < b.height ) ydiff = b.height - c.height; // size north
                        if (this.options.constrainRatio) {
                            if(c.right + ydiff > b.right ) {
                                xdiff = b.right - c.right;
                                ydiff = xdiff;
                                styles.width = c.width + xdiff;
                                styles.height = c.height + ydiff;
                            } else {
                                styles.width = c.width + ydiff;
                                styles.height = c.height + ydiff;
                            }
                        } else {
                            styles.height = c.height + ydiff;
                        }
                        styles.top = c.top - ydiff;
                    } else

                    if( handle.contains("E") && !handle.contains("S") && !handle.contains("N")){//EAST
                        if(c.right - xdiff > b.right) xdiff = c.right - b.right; //box east
                        if( (c.width - xdiff) < b.width ) xdiff = c.width - b.width; // size east
                        if (this.options.constrainRatio) {
                            if(c.bottom - xdiff > b.bottom ) {
                                xdiff = c.bottom - b.bottom;
                                ydiff = xdiff;
                                    styles.width = c.width - xdiff;
                                    styles.height = c.height - ydiff;
                            } else {
                                    styles.width = c.width - xdiff;
                                    styles.height = c.height - xdiff;
                            }
                        } else {
                            styles.width = c.width - xdiff;
                        }
                    } else

                    if( handle.contains("W") && !handle.contains("S") && !handle.contains("N")){//WEST
                        if(c.left - xdiff < b.left) xdiff = c.left; //box west
                        if( (c.width + xdiff) < b.width ) xdiff = b.width - c.width; //size west
                        if (this.options.constrainRatio) {
                            if (c.bottom + xdiff > b.bottom ) {
                                xdiff = b.bottom - c.bottom;
                                ydiff = xdiff;
                                    styles.width = c.width + xdiff;
                                    styles.height = c.height + ydiff;
                            } else {
                                    styles.width = c.width + xdiff;
                                    styles.height = c.height + xdiff;
                            }
                        } else {
                            styles.width = c.width + xdiff;
                        }
                        styles.left = c.left - xdiff;
                    } else

                    if( handle.contains("S") && handle.contains("E") ){//SOUTH & EAST

                        if(c.right - xdiff > b.right) { xdiff = c.right - b.right; }//box east

                        if (this.options.constrainRatio) {
                            if(c.bottom - xdiff > b.bottom ) { xdiff = c.bottom - b.bottom; }// box south
                        } else {
                            if(c.bottom - ydiff > b.bottom ) { ydiff = c.bottom - b.bottom; }// box south
                        }

                        if( (c.width - xdiff) < b.width ) xdiff = c.width - b.width; // size east
                        if( (c.height - ydiff) < b.height ) ydiff = c.height - b.height; // size south

                        if (this.options.constrainRatio) {
                            styles.width = c.width - xdiff;
                            styles.height = c.height - xdiff;
                        } else {
                            styles.width = c.width - xdiff;
                            styles.height = c.height - ydiff;
                        }


                    } else

                    if( handle.contains("N") && handle.contains("E") ){//NORTH & EAST

                        if(c.right - xdiff > b.right) { xdiff = c.right - b.right; }//box east

                        if (this.options.constrainRatio) {
                            if(c.top + xdiff < b.top ) { xdiff = b.top - c.top; }// box south
                        } else {
                            if(c.top - ydiff < b.top ) { ydiff = c.top - b.top; }// box south
                        }

                        if( (c.width - xdiff) < b.width ) xdiff = c.width - b.width; // size east
                        if( (c.height + ydiff ) < b.height ) ydiff = b.height - c.height; // size north

                        if (this.options.constrainRatio) {
                            styles.width = c.width - xdiff;
                            styles.height = c.height - xdiff;
                            styles.top = c.top + xdiff;
                        } else {
                            styles.width = c.width - xdiff;
                            styles.height = c.height + ydiff;
                            styles.top = c.top - ydiff;
                        }
                    } else

                    if( handle.contains("S") && handle.contains("W") ){//SOUTH & WEST

                        if(c.left - xdiff < b.left) { xdiff = c.left - b.left; }//box east

                        if (this.options.constrainRatio) {
                            if(c.bottom + xdiff > b.bottom ) { xdiff = b.bottom - c.bottom; }// box south
                        } else {
                            if(c.bottom - ydiff > b.bottom ) { ydiff = c.bottom - b.bottom; }// box south
                        }

                        if( (c.height - ydiff) < b.height ) ydiff = c.height - b.height; // size south
                        if( (c.width + xdiff) < b.width ) xdiff = b.width - c.width; //size west

                        if (this.options.constrainRatio) {
                            styles.width = c.width + xdiff;
                            styles.height = c.height + xdiff;
                            styles.left = c.left - xdiff;
                        } else {
                            styles.width = c.width + xdiff;
                            styles.height = c.height - ydiff;
                            styles.left = c.left - xdiff;
                        }


                    } else

                    if( handle.contains("N") && handle.contains("W") ){//WEST & NORTH

                        if(c.left - xdiff < b.left) { xdiff = c.left - b.left; }//box east

                        if (this.options.constrainRatio) {
                            if(c.top - xdiff < b.top ) { xdiff = c.top - b.top; }// box south
                        } else {
                            if(c.top - ydiff < b.top ) { ydiff = c.top - b.top; }// box south
                        }

                        if( (c.height + ydiff ) < b.height ) ydiff = b.height - c.height; // size north
                        if( (c.width + xdiff) < b.width ) xdiff = b.width - c.width; //size west

                        if (this.options.constrainRatio) {
                            styles.width = c.width + xdiff;
                            styles.height = c.height + xdiff;
                            styles.left = c.left - xdiff;
                            styles.top = c.top - xdiff;
                        } else {
                            styles.width = c.width + xdiff;
                            styles.height = c.height + ydiff;
                            styles.left = c.left - xdiff;
                            styles.top = c.top - ydiff;
                        }


                    }
        }

        var preCssStyles = $merge(styles);
        if( $defined(styles.width)) styles.width -= this.boxDiff*2;
        if( $defined(styles.height)) styles.height -= this.boxDiff*2;
        this.cropArea.setStyles(styles);
        this.getCurrentCoords(preCssStyles);
        this.drawMasks();
        this.positionHandles();
        this.fireEvent('onCrop',[this.img.src,this.getCropInfo(),b,handle]);

    },

    getCurrentCoords : function(changed){
        var current = $merge(this.crop);

        if($defined(changed.left)){
            current.left = changed.left;
            if($defined(changed.width)) current.width = changed.width;
            else current.right = current.left + current.width;
        }
        if($defined(changed.top)){
            current.top = changed.top;
            if($defined(changed.height)) current.height = changed.height;
            else current.bottom = current.top + current.height;
        }
        if($defined(changed.width) && !$defined(changed.left)){
            current.width = changed.width;
            current.right = current.left + current.width;
        }
        if($defined(changed.height) && !$defined(changed.top)){
            current.height = changed.height;
            current.bottom = current.top + current.height;
        }
        this.current.crop = current;
    },

    drawMasks : function(){
        if(!this.options.showMask) return;
        var b = this.bounds;
        var c = this.current.crop;
        var handle = this.current.handle;
        this.north.setStyle('height', c.top + 'px' );
        this.south.setStyle('height', b.bottom  - c.bottom  + 'px');
        this.east.setStyles({ 'height': c.height + 'px', 'width': b.right  - c.right + 'px',  'top': c.top  + 'px', 'left': c.right + 'px'});
        this.west.setStyles({ 'height': c.height + 'px', 'width': c.left + 'px', 'top': c.top + 'px'});
    },

    positionHandles: function(){
        if(!this.calculateHandles) return;
        var c = this.current.crop; var wOffset = this.handleWidthOffset; var hOffset = this.handleHeightOffset;

        this.handles.get('N').setStyles({'left' : c.width / 2 - wOffset + 'px', 'top' : - hOffset + 'px'});
        this.handles.get('NE').setStyles({'left' : c.width - wOffset + 'px', 'top' : - hOffset + 'px'});
        this.handles.get('E').setStyles({ 'left' : c.width - wOffset + 'px', 'top' : c.height / 2 - hOffset + 'px'});
        this.handles.get('SE').setStyles({'left' : c.width - wOffset + 'px', 'top' : c.height - hOffset + 'px'});
        this.handles.get('S').setStyles({'left' : c.width / 2 - wOffset + 'px', 'top' : c.height - hOffset + 'px'});
        this.handles.get('SW').setStyles({'left' : - wOffset + 'px', 'top' : c.height - hOffset + 'px'});
        this.handles.get('W').setStyles({'left' : - wOffset + 'px', 'top' : c.height / 2 - hOffset + 'px'});
        this.handles.get('NW').setStyles({'left' : - wOffset + 'px', 'top' : - hOffset + 'px'});
    },

    hideHandles: function(){
        this.calculateHandles = false;
        this.handles.each(function(handle){
            handle.setStyle('display','none');
        });
    },

    showHandles: function(){
        this.calculateHandles = true;
        this.positionHandles();
        this.handles.each(function(handle){
            handle.setStyle('display','block');
        });
    },

    buildOverlay: function(){
        var o = this.options;
        this.img.setStyle('padding','0');
        this.wrapper = new Element('div', {
            'styles' :  {'position' : 'relative', 'width' : this.img.width, 'height' : this.img.height, 'background' : 'url('+this.img.src+') no-repeat' , 'float' : this.img.getStyle('float')}
        }).inject(this.img,'before');

        this.imgsize = {'width' : this.img.width, 'height' : this.img.height};
        this.img.setStyle('display','none');
        this.offsets = { x : this.wrapper.getCoordinates().left, y : this.wrapper.getCoordinates().top };

        if(this.options.showMask){      // optional masks
            var maskStyles = { 'position' : 'absolute', 'overflow' : 'hidden', 'background-color' : o.maskColor, 'opacity' : o.maskOpacity};
            this.north = new Element("div", {'styles' : maskStyles}).inject(this.wrapper);
            this.south = new Element("div", {'styles' : $merge(maskStyles,{'bottom':'0px'})}).inject(this.wrapper);
            this.east =  new Element("div", {'styles' : maskStyles}).inject(this.wrapper);
            this.west =  new Element("div", {'styles' : maskStyles}).inject(this.wrapper);
        }
        this.cropArea = new Element("div", { 'styles' : { 'position' : 'absolute', 'top' : '0px', 'left' : '0px', 'border' : o.cropBorder, 'cursor' : 'move' },
        'events' : {
            'dblclick' : function(){ this.fireEvent('onDblClk',[this.img.src,this.getCropInfo(),this.bounds])}.bind(this),
            'mousedown' : this.activate.bindWithEvent(this,'NESW')}
        }).inject(this.wrapper,'bottom');

        this.handles = new Hash();
        ['N','NE','E','SE','S','SW','W','NW'].each(function(handle){
            this.handles.set(handle, new Element("div", {
            'styles' : { 'position' : 'absolute', 'background-color' : o.handleColor,
                         'width' : o.handleWidth, 'height' : o.handleHeight, 'overflow' : 'hidden', 'cursor' : (handle.toLowerCase()+'-resize')},
            'events' : {'mousedown' : this.activate.bindWithEvent(this,handle)}
            }).inject(this.cropArea,'bottom'));
        },this);

    },

    getCropInfo : function(){
        var c = $merge(this.current.crop);
        c.width -= this.boxDiff*2; c.height -= this.boxDiff*2;
        return c;
    },

    removeOverlay: function(){
        this.wrapper.remove();
        this.img.setStyle('display','block');
    }

});

