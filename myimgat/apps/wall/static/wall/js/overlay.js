(function(global, $){

    var Overlay = global.Overlay = new Class({
        Implements: [Events, Options],

        initialize: function(options) {
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
            this._block = true;
            return this;
        },

        unblock: function() {
            this._block = false;
            return this;
        },

        onClose: function() {
            if (this._block) return;
            this.hide();
            return this.fireEvent('close');
        }
    });

}(this, document.id));

