(function(global, $){

    var Overlay = global.Overlay = new Class({
        Implements: [Events, Options],

        initialize: function(element, options) {
            this.setOptions(options);
            this.create();
        },

        create: function() {
            this.element = new Element('div', {
                'class': 'overlay',
                events: {
                    click: this.onClose.bind(this)
                }
            }).fade('hide');
            $$('body').grab(this.element);
        },

        show: function() {
            return this.element.fade('in');
        },

        hide: function() {
            return this.element.fade('out');
        },

        block: function() {
            this.block = true;
            return this;
        },

        unblock: function() {
            this.block = false;
            return this;
        },

        onClose: function() {
            if (this.block) return;
            this.hide();
            return this.fireEvent('close');
        }
    });

}(this, document.id));

