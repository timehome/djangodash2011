/*
http://www.nwhite.net/2009/02/25/lassocrop-preview/
*/

var Lasso = new Class({

    Implements : [Options, Events],

    active : false,

    options : {
        autoHide: true,
        cropMode : false,
        globalTrigger : false,
        min : false,
        max : false,
        ratio : false,
        contain : false,
        trigger : null,
        border : '#999',
        color : '#7389AE',
        opacity : .3,
        zindex : 10000
    },

    binds : {},

    initialize : function(options){
        this.setOptions(options);

        this.box = new Element('div', {
            'styles' : { 'display' : 'none', 'position' : 'absolute',  'z-index' : this.options.zindex }
        }).inject((this.container) ? this.container : document.body);

        this.overlay = new Element('div',{
            'styles' : { 'position' : 'relative', 'background' : 'url(blank.gif)', 'height' : '100%', 'width' : '100%',   'z-index' : this.options.zindex+1 }
        }).inject(this.box);

        this.mask = new Element('div',{
            'styles' : { 'position' : 'absolute', 'background-color' : this.options.color, 'opacity' : this.options.opacity, 'height' : '100%', 'width' : '100%', 'z-index' : this.options.zindex-1 }
        });

        if(this.options.cropMode){
            this.mask.setStyle('z-index',this.options.zindex-2).inject(this.container);
            this.options.trigger = this.mask; // override trigger since we are a crop
        } else {
            this.mask.inject(this.overlay);
        }

        this.trigger = $(this.options.trigger);

        // Marching Ants
        var antStyles = { 'position' : 'absolute', 'width' : 1, 'height' : 1, 'overflow' : 'hidden', 'z-index' : this.options.zindex+1 };

        if( this.options.border.test(/\.(jpe?g|gif|png)/) ) antStyles.backgroundImage = 'url('+this.options.border+')';
        else var antBorder = '1px dashed '+this.options.border;

        this.marchingAnts = {};
        ['left','right','top','bottom'].each(function(side,idx){
            switch(side){
                case 'left' : style = $merge(antStyles,{top : 0, left : -1, height : '100%'}); break;
                case 'right' : style = $merge(antStyles,{top : 0, right : -1, height : '100%'}); break;
                case 'top' : style = $merge(antStyles,{top : -1, left : 0, width : '100%'}); break;
                case 'bottom' : style = $merge(antStyles,{bottom : -1, left : 0, width : '100%'}); break;
            }
            if(antBorder) style['border-'+side] = antBorder;
            this.marchingAnts[side] = new Element('div',{ 'styles' : style}).inject(this.overlay);
        },this);

        this.binds.start = this.start.bindWithEvent(this);
        this.binds.move = this.move.bindWithEvent(this);
        this.binds.end = this.end.bindWithEvent(this);

        this.attach();

        document.body.onselectstart = function(e){ e = new Event(e).stop(); return false; };

        // better alternative?
        this.removeDOMSelection = (document.selection && document.selection.empty) ? function(){ document.selection.empty(); } :
            (window.getSelection) ? function(){ var s=window.getSelection();if(s && s.removeAllRanges) s.removeAllRanges();} : $lambda(false);

        this.resetCoords();
    },

    attach : function(){
        this.trigger.addEvent('mousedown', this.binds.start);
    },

    detach : function(){
        if(this.active) this.end();
        this.trigger.removeEvent('mousedown', this.binds.start);
    },

    start : function(event){
        if((!this.options.autoHide && event.target == this.box) || (!this.options.globalTrigger && (this.trigger != event.target))) return false;
        this.active = true;
        document.addEvents({ 'mousemove' : this.binds.move, 'mouseup' : this.binds.end });
        this.resetCoords();
        if(this.options.contain) this.getContainCoords();
        if(this.container) this.getRelativeOffset();
        this.setStartCoords(event.page);
        this.fireEvent('start');
        return true;
    },

    move : function(event){
        if(!this.active) return false;

        this.removeDOMSelection(); // clear as fast as possible!

        // saving bytes s = start, m = move, c = container
        var s = this.coords.start, m = event.page, box = this.coords.box = {}, c = this.coords.container;

        if(this.container){ m.y -= this.offset.top; m.x -= this.offset.left; }

        var f = this.flip = { y : (s.y > m.y), x : (s.x > m.x) }; // flipping orgin? compare start to move
        box.y = (f.y) ? [m.y,s.y] : [s.y, m.y]; // order y
        box.x = (f.x) ? [m.x,s.x] : [s.x, m.x]; // order x

        if(this.options.contain){
            if(box.y[0] < c.y[0] ) box.y[0] = c.y[0]; // constrain top
            if(box.y[1] > c.y[1] ) box.y[1] = c.y[1]; // constrain bottom
            if(box.x[0] < c.x[0] ) box.x[0] = c.x[0]; // constrain left
            if(box.x[1] > c.x[1] ) box.x[1] = c.x[1]; // constrain right
        }

        if(this.options.max){ // max width & height
            if( box.x[1] - box.x[0] > this.options.max[0]){ // width is larger then max, fix
                if(f.x) box.x[0] = box.x[1] - this.options.max[0]; // if flipped
                else box.x[1] = box.x[0] + this.options.max[0]; // if normal
            }
            if( box.y[1] - box.y[0] > this.options.max[1]){ // height is larger then max, fix
                if(f.y) box.y[0] = box.y[1] - this.options.max[1]; // if flipped
                else box.y[1] = box.y[0] + this.options.max[1];  // if normal
            }
        }

        // ratio constraints
        if(this.options.ratio){
            var ratio = this.options.ratio;
            // get width/height divide by ratio
            var r = { x  : (box.x[1] - box.x[0]) / ratio[0],  y  : (box.y[1] - box.y[0]) / ratio[1] };
            if(r.x > r.y){ // if width ratio is bigger fix width
                if(f.x) box.x[0] =  box.x[1] - (r.y * ratio[0]); // if flipped width fix
                else    box.x[1] =  box.x[0] + (r.y * ratio[0]); // normal width fix
            } else if( r.x < r.y){ // if height ratio is bigger fix height
                if(f.y) box.y[0] =  box.y[1] - (r.x * ratio[1]); // if flipped height fix
                else    box.y[1] =  box.y[0] + (r.x * ratio[1]); // normal height fix
            }
        }

        this.refresh();
        return true;
    },

    refresh : function(){
        var c = this.coords, box = this.coords.box, cc = this.coords.container;
        c.w = box.x[1] - box.x[0];
        c.h = box.y[1] - box.y[0];
        c.top = box.y[0];
        c.left = box.x[0];
        this.box.setStyles({'display' : 'block',  'top' : c.top, 'left' : c.left, 'width' : c.w, 'height' : c.h });
        this.fireEvent('resize',this.getRelativeCoords());
    },

    end : function(event){
        if(!this.active) return false;
        this.active = false;
        document.removeEvents({ 'mousemove' : this.binds.move, 'mouseup' : this.binds.end });
        if(this.options.autoHide) this.resetCoords();
        else if(this.options.min){
            if(this.coords.w < this.options.min[0] || this.coords.h < this.options.min[1]) this.resetCoords();
        }
        var ret = (this.options.autoHide) ? null : this.getRelativeCoords();
        this.fireEvent('complete',ret);
        return true;
    },

    setStartCoords : function(coords){
        if(this.container){ coords.y -= this.offset.top; coords.x -= this.offset.left; }
        this.coords.start = coords;  this.coords.w = 0; this.coords.h = 0;
        this.box.setStyles({ 'display' : 'block', 'top' : this.coords.start.y, 'left' : this.coords.start.x });
    },

    resetCoords : function(){
        this.coords = { start : {x : 0, y : 0}, move : {x : 0, y : 0}, end : {x: 0, y: 0}, w: 0, h: 0};
        this.box.setStyles({'display' : 'none', 'top' : 0, 'left' : 0, 'width' : 0, 'height' : 0});
        this.getContainCoords();
    },

    getRelativeCoords : function(){
        var box = this.coords.box, cc = $merge(this.coords.container), c = this.coords;
        if(!this.options.contain) cc = { x : [0,0], y : [0,0]};
        return { x : (box.x[0] - cc.x[0]).toInt(), y : (box.y[0] - cc.y[0]).toInt(), w : (c.w).toInt(), h : (c.h).toInt() };
    },

    getContainCoords : function(){
        var tc = this.trigger.getCoordinates(this.container);
        this.coords.container = { y : [tc.top,tc.top+tc.height], x : [tc.left,tc.left+tc.width] }; // FIXME
    },

    getRelativeOffset : function(){
        this.offset = this.container.getCoordinates();
    },

    reset : function(){
        this.detach();
    }

});

